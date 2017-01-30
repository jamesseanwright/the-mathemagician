#!/usr/bin/env bash

minified_byte_length=$1
crushed_byte_length=$2
output_file=bundleSize.json

# Remove closing array bracket
data=$(sed "s/]//" $output_file)

# Add new size data
date=$(date +%s)

data="
$data,{\"date\":$date,\"minified\":$minified_byte_length,\"crushed\":$crushed_byte_length}]"

echo $data > bundleSize.json