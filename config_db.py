from sqlalchemy import create_engine, Column, Integer
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

Base = declarative_base()


class Config:
    def __init__(self):
        self.db = Database()
        self.number_of_sensors: int = self.db.get_data()


class Database:
    def __init__(self):
        self.database_path: str = 'config.db'
        self.engine = create_engine(f"sqlite:///{self.database_path}", echo=True)
        Base.metadata.create_all(self.engine)
        self.session = sessionmaker(bind=self.engine)()

        if not self.check_if_record_exists():
            self.settings_entry = Settings(number_of_sensors=3)
            self.session.add(self.settings_entry)
            self.session.commit()

    def check_if_record_exists(self):
        record_exists = self.session.query(Settings).first()
        if record_exists:
            return True
        else:
            return False

    def get_data(self):
        all_settings = self.session.query(Settings).all()
        for setting in all_settings:
            return setting.number_of_sensors

    def set_new_value(self, value: int) -> None:
        record_to_update = self.session.query(Settings).first()
        if record_to_update:
            record_to_update.number_of_sensors = value
            self.session.commit()
            print("Value updated successfully.")
        else:
            print("No record found to update.")


class Settings(Base):
    __tablename__ = 'settings'
    id = Column(Integer, primary_key=True)
    number_of_sensors = Column(Integer, nullable=False)
