from setuptools import setup
import os

company_name = 'Vilmio s.r.o'
product_name = 'Vilmio battery protection'

APP = ['web_server_app.py']


def find_files(directory):
    paths = []
    for root, _, files in os.walk(directory):
        for file in files:
            full_path = os.path.join(root, file)
            paths.append(full_path)
    return paths


browser_files = find_files('frontend/dist/frontend/browser')
assets_files = find_files('frontend/dist/frontend/browser/assets')
media_files = find_files('frontend/dist/frontend/browser/media')

DATA_FILES = [
    ('frontend/dist/frontend/browser', browser_files),
    ('frontend/dist/frontend/browser/assets', browser_files),
    ('frontend/dist/frontend/browser/media', media_files)
]

OPTIONS = {
    'argv_emulation': False,
    'packages': ['flask'],
    'iconfile': 'images/icon.icns'
}

setup(
    app=APP,
    data_files=DATA_FILES,
    options={'py2app': OPTIONS},
    name=product_name,
    version="1.0.2",
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