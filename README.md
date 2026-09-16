# Practical Work

> [!WARNING]
> Necessary to have: __Docker__, __Make__, __Go__\
> (Make usually comes with installing __build-essential__ or just __make__)

## application dir:

Contains main application with database
> [!NOTE]
> Use [THIS](application/README.md) guide to add all necessary files

To start that process for testing purpose use this command:
```bash
make app_test
```

After testing it use this command to start real application:
```bash
make app_start
```


## recording dir:

Contains docker with MediaMTX that proxies video translation from cameras to application and saves it in different directory with dates.
> [!NOTE]
> Use [THIS](recording/README.md) instructions before doing next step

After you've done what was [there](recording/README.md), start generating files:
```bash
make rec_gen
```
> It generates file for MediaMTX

After all files has been done, start that process:
```bash
make rec_start
```

If you want to translate it live, use next command:
```bash
make rec_live
```
