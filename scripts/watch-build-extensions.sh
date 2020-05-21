#!/bin/bash
if [ -d "./extensions" ]
then
  parcel watch extensions/* -d public
fi

