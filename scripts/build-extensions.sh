#!/bin/bash
if [ -d "./extensions" ]
then
  parcel build extensions/* -d public
fi