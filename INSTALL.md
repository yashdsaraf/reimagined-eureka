# Initial setup instructions

**Note:**
  - Only windows _7 or greater_ (64 bit) is supported as a development platform.
  - Use 64 bit versions of applications wherever applicable.

### Please make sure you have the following installed before proceeding
**[Chocolatey](https://chocolatey.org/) is recommended for package management**

Required:
  - jdk 8 (latest available)
  - nodejs (>= 8.3.0) & npm
  - maven (>= 3.5.0)
  - oracle 11g XE
  - Firefox, Chrome, Edge, IE (>v9) or any other modern browser with JS ES6 or cross browser polyfill support

Optional:
  - Netbeans IDE Java EE (>=8.2)
  - [Netbeans typescript plugin](https://github.com/Everlaw/nbts/releases/latest)
  - SQL Developer

### Setup oracle
  - Run `cmd` as admin.
  - `cd` to  *\<oracle installation directory>\app\oracle\product\11.2.0\server\jdbc\lib*
  - Run the following command 
  ```shell
  mvn install:install-file -Dfile=ojdbc6.jar -DgroupId=com.oracle -DartifactId=ojdbc6 -Dversion=11.2.0 -Dpackaging=jar
  ```
  - Create a YAML file for database configuration properties at `reimagined-eureka\server\src\main\resources\application.yml` (You can refer to the `application.yml.stub` file in the same directory)

### Netbeans specific setup instructions
  - Download [Netbeans typescript plugin](https://github.com/Everlaw/nbts/releases/latest).
  - Open `Tools > Plugins` and go to `Downloaded` tab.
  - Click on `Add plugins` and select the previously downloaded `.nbm` file.
  - Follow the steps on the screen to finish the installation.
  - Open `Tools > Options > HTML/JS`.
  - Make sure `Node Path` and `npm Path` are set to correct locations of `node` and `npm` installed in your system.
  - Click on `Download` next to `Sources` input if not already downloaded.
  
### That's it! Go to [README](README.md) for further instructions.
