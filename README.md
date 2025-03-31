# Graphic Spice

**Graphic Spice** is an open-source SPICE circuit design and simulation visual tool.

## Under The Hood
**Graphic Spice** uses the following packages under the hood:
- Simulation Engine: [NGSpice](https://ngspice.sourceforge.io/)
- Engine Rust Binding: [Paprika](https://github.com/ua-kxie/paprika?tab=readme-ov-file)
- Desktop Framework: [Tauri](https://v2.tauri.app/)
- Front-End Build Tool: [Vite](https://vite.dev/)

## Getting Started

### Installing The App

You can download the latest release artifacts from the [releases page](https://github.com/juligarcia/ngg-spice/releases).

#### macOS Caveat

Since this proyect is not code signed (yet) you'll have to forcefully code sign it to install on macOS. To do that you can execute the following script in your terminal:

```shell
xattr -rc /Applications/Graphic\ Spice.app && codesign --force --deep --sign - /Applications/Graphic\ Spice.app
```

### User Guide

If you want to learn _how_ to use **Graphic Spice** you can follow the following guides:

- [Introduction to Graphic Spice's UI](./user-guide/intro_to_gsp.pdf)
- [Opening ".gsp" files](./user-guide/opening_gsp_files.pdf)
- [Opening LTSpice (".asc") files](./user-guide/opening_asc_files.pdf)
- [Intro to circuit design in Graphic Spice](./user-guide/circuit_design.pdf)
- [Configuring simulations in Graphic Spice](./user-guide/simulations.pdf)
- [Visualizing results in Graphic Spice](./user-guide/visualizer.pdf)

### Developing

Running the app:

```shell
yarn tauri dev
```

Building the app:

```shell
yarn tauri build
```