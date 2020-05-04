Handy tip for a command to resize images using [ImageMagick](https://imagemagick.org):

```
convert some-file.png -thumbnail 236x236^ -extent 236x236 some-file.236x236.jpg
```

The purpose of this is to:
- strip meta info (using `-thumbnail` instead of `-resize`)
- make it _at least_ 236x236 (by adding the `^` to the thumbnail geometry value)
- _then_ crop it to actually be the size we want (it seems a two step process is needed here)

http://www.imagemagick.org/script/command-line-processing.php#geometry has some more docs.
