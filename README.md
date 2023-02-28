# README

## About

This is the repository for an implementation of the Ableton Push 2 Simulator.

It uses `wails` as the application framework. Wails itself is a tool written mostly in go that helps building applications with go and web technologies.

The `frontend` folder contains a project in react. At the root you should find the go related packages and the `main.go` entry point.

## Live Development

To run in live development mode, run `wails dev` in the project directory. This will run a Vite development
server that will provide very fast hot reload of your frontend changes. If you want to develop in a browser
and have access to your Go methods, there is also a dev server that runs on http://localhost:34115. Connect
to this in your browser, and you can call your Go code from devtools.

## Building

To build a redistributable, production mode package, use `wails build`.
