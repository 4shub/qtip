#!/bin/bash
if [ -d "./extensions" ]
then
  ./node_modules/.bin/parcel watch extensions/* -d public
fi

