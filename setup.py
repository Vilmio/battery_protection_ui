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
    "include_files": ['main'], "packages": ['flask']
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
    executables=[Executable("webServerApp.py",
                            base=base,
                            icon="images/icon.ico"
                            )])
