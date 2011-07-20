#!/bin/bash
JSDOC_HOME="./tools/jsdoc_toolkit-2.4.0"

if [ ! -d "$JSDOC_HOME" ]; then
	echo "Run this script from the TOP FOLDER!"
	echo "Error: Could not find '$JSDOC_HOME'."
	exit 1
fi

# -a Include undocumented functions
# -d output directory
java -jar $JSDOC_HOME/jsrun.jar $JSDOC_HOME/app/run.js -a -t=./tools/jsdoc-templates -d=doc/api js/*

############################################################
# Developer Documentation inclusive private methods.
# -a Include undocumented functions
# -d output directory
# -p Include symbols tagged as private, underscored and inner symbols.
############################################################
java -jar $JSDOC_HOME/jsrun.jar $JSDOC_HOME/app/run.js -p -a -t=./tools/jsdoc-templates -d=doc/api-dev js/*

# automatically add the new files to svn
#svn add doc/api-dev/symbols/*
#svn add doc/api-dev/symbols/*/*
