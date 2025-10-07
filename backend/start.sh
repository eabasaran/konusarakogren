#!/bin/bash
cd backend/MessageApi
dotnet publish -c Release -o out
cd out
dotnet MessageApi.dll
