#!/bin/bash
kill $(ps aux | grep babel | head -n 2 | awk -F ' ' '{print $2}')
