from setuptools import setup

setup(
    name='qtip',
    version='0.1',
    py_modules=['qtip'],
    install_requires=[
        'Click',
        'requests'
    ],
    entry_points='''
        [console_scripts]
        yourscript=yourscript:cli
    ''',
)