```console
$ node --version
v8.3.0
```

# Run for a file

Give a file through `stdin`.

```console
$ node s1.js < .\io\S1\s1.1.in
Commodore
Atari
```

# Check whole in/out pairs

Give `--test`.

```console
$ node s1.js --test
./io/S1/s1.1.in Commodore, Atari
-- ERROR: it should be following
Atari
Commodore

./io/S1/s1.2.in THISONE, THISONETOO
./io/S1/s1.3.in RIGHT, YOUARE
./io/S1/s1.4.in AAAAAAAAAAAAAAAAAAAA, BBBBBBBBBBBBBBBBBBBB
./io/S1/s1.5.in LFT, ABC
./io/S1/s1.6.in LFT, ABC
./io/S1/s1.7.in GG, design
./io/S1/s1.8.in
./io/S1/s1.9.in ACB
```
