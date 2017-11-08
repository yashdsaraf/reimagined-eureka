DEVELOP | MASTER
--------|-------
[![Build status](https://ci.appveyor.com/api/projects/status/srqx7hncxmdh6shb/branch/develop?svg=true)](https://ci.appveyor.com/project/yashdsaraf/reimagined-eureka/branch/develop) | [![Build status](https://ci.appveyor.com/api/projects/status/srqx7hncxmdh6shb/branch/master?svg=true)](https://ci.appveyor.com/project/yashdsaraf/reimagined-eureka/branch/master)

# Online Plugglable IDE

For initial setup instructions go to [INSTALL](INSTALL.md)

## Run the app
  - Run `configure.bat` either by double clicking it  
    *OR*  
  running it from `cmd.exe` after `cd`ing into the project directory.
  ### Start the backend
  - Open `reimagined-eureka/server` folder in *Netbeans*, right click on the project and select **Run**  
    *OR*  
  Open a terminal, `cd` to `reimagined-eureka/server` and execute the command `mvn spring-boot:run`.
  ### Start the frontend
  - Open `reimagined-eureka/frontend` folder in *Netbeans*, right click on the project, from `npm scripts` select **npm start**  
    *OR*  
  Open a terminal, `cd` to `reimagined-eureka/frontend` and execute the command `npm start`.

### For developers
  - [Frontend style guide](https://google.github.io/styleguide/htmlcssguide.html)
  - [Java style guide](https://google.github.io/styleguide/javaguide.html)
