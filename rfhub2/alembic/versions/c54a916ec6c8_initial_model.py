"""Initial model

Revision ID: c54a916ec6c8
Revises: 
Create Date: 2020-04-01 21:02:20.117380

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "c54a916ec6c8"
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table(
        "collection",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("name", sa.Text(), nullable=True),
        sa.Column("type", sa.Text(), nullable=True),
        sa.Column("version", sa.Text(), nullable=True),
        sa.Column("scope", sa.Text(), nullable=True),
        sa.Column("named_args", sa.Text(), nullable=True),
        sa.Column("path", sa.Text(), nullable=True),
        sa.Column("doc", sa.Text(), nullable=True),
        sa.Column("doc_format", sa.Text(), nullable=True),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_collection_name"), "collection", ["name"], unique=False)
    op.create_table(
        "keywordstatistics",
        sa.Column("collection", sa.Text(), nullable=False),
        sa.Column("keyword", sa.Text(), nullable=False),
        sa.Column("execution_time", sa.DateTime(timezone=True), nullable=False),
        sa.Column("times_used", sa.Integer(), nullable=True),
        sa.Column("total_elapsed", sa.Integer(), nullable=True),
        sa.Column("min_elapsed", sa.Integer(), nullable=True),
        sa.Column("max_elapsed", sa.Integer(), nullable=True),
        sa.PrimaryKeyConstraint("collection", "keyword", "execution_time"),
    )
    op.create_table(
        "keyword",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("name", sa.Text(), nullable=True),
        sa.Column("doc", sa.Text(), nullable=True),
        sa.Column("args", sa.Text(), nullable=True),
        sa.Column("collection_id", sa.Integer(), nullable=False),
        sa.ForeignKeyConstraint(
            ["collection_id"], ["collection.id"], ondelete="CASCADE"
        ),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_keyword_name"), "keyword", ["name"], unique=False)
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_index(op.f("ix_keyword_name"), table_name="keyword")
    op.drop_table("keyword")
    op.drop_table("keywordstatistics")
    op.drop_index(op.f("ix_collection_name"), table_name="collection")
    op.drop_table("collection")
    # ### end Alembic commands ###