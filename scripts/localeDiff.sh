SCRIPT=$(cat <<-END
    const locales = require('./client/app/locales/locale-en.json');
    function print(prefix, obj) {
      for(let key in obj) {
        if(obj[key] instanceof Object) {
          print(prefix+key+'.', obj[key]);
        } else {
          console.log(prefix+key);
        }
      }
    }
    print('', locales);
END
)
echo $SCRIPT | node | sort > /tmp/locale_current

grep -REoh "(translate=\"[^\"]*?\"|\\\$translate\(\"[^\"]*?\"|(\"|')[^\"\']+(\"|')[ ]*\|[ ]*translate)" client | \
  grep -Eo "(\"|')[^\"\']+(\"|')" | \
  cut -c 2- | rev | cut -c 2- | rev | \
  grep -v "\{" | \
  sort -u > /tmp/locale_inuse

diff /tmp/locale_current /tmp/locale_inuse
