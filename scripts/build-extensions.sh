#!/bin/bash
if [ -d "./extensions" ]
then
  ./node_modules/.bin/parcel build extensions/* -d public
fi