# Initial setup instructions

**Note:**
  - Only windows _7 or greater_ (64 bit) is supported as a development platform.
  - Use 64 bit versions of applications whenever available.

### Please make sure you have the following installed before proceeding
**[Chocolatey](https://chocolatey.org/) is recommended for package management**

Required:
  - jdk 8 (latest available)
  - oracle glassfish server (4.1.1)
  - ruby (>= 2.4.1)
  - nodejs (>= 8.3.0) & npm
  - maven (>=3.5.0)
  - oracle 11g XE

Optional:
  - Netbeans IDE Java EE (>=8.2)
  - [Netbeans typescript plugin](https://github.com/Everlaw/nbts/releases)
  - SQL Developer

## Installation
  - Run `cmd.exe` with administrator privileges.
  - Install **angular-cli**
    `npm install -g @angular/cli gulp`
  - Install **sass**
    `gem install sass`
  - `cd` to project's root directory
  - Install all frontend dependencies
    `npm install`
  - Install oracle driver as maven plugin
    `mvn install:install-file -Dfile=lib/ojdbc6.jar -DgroupId=com.oracle -DartifactId=ojdbc6 -Dversion=11.2.0 -Dpackaging=jar`

### Netbeans specific setup instructions
  - Download [Netbeans typescript plugin](https://github.com/Everlaw/nbts/releases)
  - Open `Tools > Plugins` and go to `Downloaded` tab
  - Click on `Add plugins` and select the previously downloaded `.nbm` file
  - Follow the steps on the screen to finish the installation
  - Open `Tools > Options > HTML/JS`
  - Make sure `Node Path` and `npm Path` are set to correct locations of `node` and `npm` installed in your system
  - Click on `Download` next to `Sources` input if not already downloaded
  - Go to `CSS Preprocessors` tab
  - Make sure `Sass path` is set to the correct location of `sass.bat` installed in your system

