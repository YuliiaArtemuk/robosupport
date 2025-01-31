"""logs

Revision ID: e8ad3c22cd22
Revises: 51eb71d2e48f
Create Date: 2024-11-09 15:09:52.841586

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'e8ad3c22cd22'
down_revision: Union[str, None] = '51eb71d2e48f'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('logs',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('username', sa.String(), nullable=True),
    sa.Column('md5_sum', sa.String(), nullable=True),
    sa.Column('instance_id', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['instance_id'], ['instances.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_logs_id'), 'logs', ['id'], unique=False)
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_index(op.f('ix_logs_id'), table_name='logs')
    op.drop_table('logs')
    # ### end Alembic commands ###
