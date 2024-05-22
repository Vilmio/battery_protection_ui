'''
from cx_Freeze import setup, Executable
import sys

company_name = 'Vilmio s.r.o'
product_name = 'Vilmio battery protection'

base = None

if sys.platform == 'win32':
    base = 'Win32GUI'

if sys.platform == 'win64':
    base = "Win64GUI"

bdist_msi_options = {
    'add_to_path': False,
    'initial_target_dir': r'[ProgramFilesFolder]\%s' % (product_name),
}

build_exe_options = {
    "include_files": [('frontend/dist/frontend/browser/', 'frontend/dist/frontend/browser/')],
    "packages": ['flask', 'sqlalchemy', 'sqlite3'],
    "includes": ['sqlalchemy.dialects.sqlite'],
}

setup(
    name=product_name,
    version="1.0.0",
    description="Vilmio battery protection",
    url="https://vilmio.com",
    author=company_name,
    author_email="vilmio@info.com",
    license="MIT",
    classifiers=[
        "License :: OSI Approved :: MIT License",
        "Programming Language :: Python :: 3",
    ],

    options={'bdist_msi': bdist_msi_options, "build_exe": build_exe_options},
    executables=[Executable("web_server_app.py",
                            base=base,
                            icon="icon.ico"
                            )])
'''

from setuptools import setup

company_name = 'Vilmio s.r.o'
product_name = 'Vilmio battery protection'

APP = ['web_server_app.py']
import os

def find_files(directory):
    paths = []
    for root, _, files in os.walk(directory):
        for file in files:
            full_path = os.path.join(root, file)
            paths.append(full_path)
    return paths

browser_files = find_files('frontend/dist/frontend/browser')
assets_files = find_files('frontend/dist/frontend/browser/assets')

DATA_FILES = [
    ('frontend/dist/frontend/browser', browser_files),
('frontend/dist/frontend/browser/assets', browser_files)
]

# Nastavení pro `py2app`
OPTIONS = {
    'argv_emulation': False,
    'packages': ['flask'],
    'iconfile': 'icon.ico'
}

# Konfigurace setupu
setup(
    app=APP,
    data_files=DATA_FILES,
    options={'py2app': OPTIONS},
    name=product_name,
    version="1.0.0",
    description="Vilmio battery protection",
    url="https://vilmio.com",
    author=company_name,
    author_email="vilmio@info.com",
    license="MIT",
    classifiers=[
        "License :: OSI Approved :: MIT License",
        "Programming Language :: Python :: 3"
    ],
    setup_requires=['py2app']
)
