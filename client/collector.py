import os

import aiohttp
import asyncio
import hashlib


BASE_URL = "http://0.0.0.0:8000"
LOGS_PATH = "/home/mushroom/.kivy/logs"
INSTANCE_ID = 1
DEFAULT_INTERVAL = 60


async def upload_log(log_path):
    async with aiohttp.ClientSession() as session:
        with open(os.path.join(LOGS_PATH, log_path), 'rb') as f:
            async with session.post(f'{BASE_URL}/logs/upload', data={'incoming_file': f}) as response:
                return await response.text()


async def check_logs(session, instance_id):
    url = f"{BASE_URL}/instances/{instance_id}/logs"
    async with session.get(url) as response:
        response.raise_for_status()
        return await response.json()


async def get_instance(session, instance_id):
    """Fetch instance details by ID."""
    url = f"{BASE_URL}/instances/{instance_id}"
    async with session.get(url) as response:
        response.raise_for_status()
        return await response.json()


async def send_log_report(session, instance_id, path, md5_sum):
    logs_url = f"{BASE_URL}/logs/"
    check_log_url = f"{BASE_URL}/instances/{instance_id}/check"
    log_data = {
        "path": path,
        "md5_sum": md5_sum,
        "instance_id": instance_id
    }

    check_data = {
        "log_path": path,
        "md5": md5_sum,
    }

    async with session.post(check_log_url, json=check_data) as response:
        response.raise_for_status()
        check = await response.json()

    if not check['result']:
        return
    print(f'[i] Log upload {await upload_log(path)}')
    async with session.post(logs_url, json=log_data) as response:
        response.raise_for_status()
        return await response.json()


async def generate_md5_checksum(log_path):
    """Generate a random MD5 checksum for log content."""
    with open(os.path.join(LOGS_PATH, log_path), 'rb') as f:
        log_content = f.read()
    return hashlib.md5(log_content).hexdigest()


async def process_log_task(session, instance_id):
    """Log task that runs periodically to send logs."""
    stored_logs = await check_logs(session, instance_id)
    # dict with path here
    for log in os.listdir(LOGS_PATH):
        md5 = await generate_md5_checksum(log)
        path = os.path.join(LOGS_PATH, log)
        if path not in stored_logs:
            log_response = await send_log_report(session, instance_id, path, md5)
            print("Log sent successfully:", log_response)
        a = 10
    # Compare with last checksum
    #if new_md5 != last_md5:
    #    print(f"New log detected. Sending to server: {new_md5}")
    #    last_md5 = new_md5
    #    username = "client_user"  # Example username; adjust as needed
    #    log_response = await send_log(session, instance_id, username, new_md5)
    #    print("Log sent successfully:", log_response)
    #else:
    #    print("No change in log content. Skipping log.")


async def main(instance_id):
    while 1:
        async with aiohttp.ClientSession() as session:
            instance_data = await get_instance(session, instance_id)
            print("Instance data:", instance_data)
            schedule_interval = instance_data["schedule_interval"]
            print(f"Schedule interval is {schedule_interval} seconds")
            await process_log_task(session, instance_id)
        await asyncio.sleep(schedule_interval)


# Run the client script
if __name__ == "__main__":
    asyncio.run(main(INSTANCE_ID))
