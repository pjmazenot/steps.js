# steps.js

*steps.js is an open source vanilla Javascript library allowing you to create user flows and guide your visitor to perform series of actions on your website.*

> **Note**: this library is now production ready! A few evolutions are already planned ([See TODO](#todo)) but don't hesitate to also send me your suggestions. And keep updated of the new releases!

## Table of Contents

  1. [Demo](#demo)
  1. [Documentation](#documentation)
  1. [Changelog](#changelog)
  1. [TODO](#todo)
  1. [Developers](#developers)
  1. [Contribute](#contribute)

## Demo 

To see a working example of how steps.js can help you guide your visitors click on the following link:

[Demo](https://pjmazenot.github.io/steps.js/ "")

## Documentation

A complete documentation is also available here: 

[Documentation](https://stepsjs.com/#getting-started "")

## Changelog

```

2017-11-26 - PRODUCTION READY
-- Version 1.0.0 --
* Add babel to gulp script for backward compatibility
* Make hint title bold by default
* Clean repo and update docs

2017-11-23
-- Version 1.0.0-rc1 --
* Add support for all Javascript events
* Add support for multiple events triggering the next step
* Add support for custom classes in options
* Improve animation fluidity on window resize

2017-11-22
-- Version 1.0.0-beta2 --
* Add window resize handling
* Add window scroll handling
* Add mobile support for documentation
* Fix a bug caused by multiple listeners on the same elements when running a flow more than once
* Fix duration option behavior
* Remove interval option

2017-11-20
-- Version 1.0.0-beta --
* Create steps.js core
* Add support for click and change event step triggers
* Add frame animation between steps
* Add hint display for each step
* Add styling options
* Add documentation
* Add README

```

## TODO

```

* Automated unit testing
* Add support for named steps and non linear user flows
* Add support full html steps definition
* Add analytics support
* Add support for other languages

```

## Developers

To setup the project clone this repo and run the command:

```
npm install
```

After modifying any file in the `src/` directory run the following command to build the script file:

```
gulp build:scripts
```

## Contribute

If you'd like to contribute to this project please contact me at [pj.mazenot@gmail.com](mailto:pj.mazenot@gmail.com "").
