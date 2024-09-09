# Folder structure

```
src
├── common
│   │    # The glue of the application, where all the common utilities and services are defined
│   │    #  and imported to all the other modules. These do not expose a API or simmilar interface.
│   │    # They can not import any `~modules`.
│   │
│   ├── config
│   │       # See ./02_Config.md
│   │
│   ├── logging
│   │       # Logging, metric and tracing.
│   │
│   └── http
│           # Api endpoint specific response, error, and log handling.
│
├── modules
│   │    # Project specific modules that define the API and the business logic of the application.
│   │    # They can import `~common` and other `~modules`, and extend `~vendors`.
│   │
│   ├── app
│   │        # The main module of the application that configures and combines modules together, exposes the API,
│   │        #  and is the entry point of the application.
│   │
│   └── [module]
│            # A module that defines a specific part of the application, such as a database, a service, or a API.
│
└── vendors
         # See ./03_Vendors.md

test
├── vendors
│       # Vendor specific tests
│
└── [module]
        # Documentation specific to a module


docs
├── vendors
│       # Template documentaton
│
└── [module]
        # Documentation specific to a module
```
