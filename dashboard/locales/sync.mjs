import fs from 'fs';

const locales = ['en-US', 'zh-TW', 'zh-CN']

const main = async () => {
    const localeDirs = locales.map(locale => {
        const localeDir = `./dashboard/locales/${locale}`
        const files = fs.readdirSync(localeDir)
        const fileMap = {}
        for (const file of files) {
            const content = fs.readFileSync(`${localeDir}/${file}`, 'utf8')
            fileMap[file] = JSON.parse(content)
        }
        return {path: localeDir, files: fileMap}
    })

    const files = Object.keys(localeDirs[0].files)
    for(const localeDir of localeDirs) {
        if(localeDir.path === localeDirs[0].path) continue

        // if there are extra files, delete them
        for(const file of Object.keys(localeDir.files)) {
            if(!files.includes(file)) {
                console.info(`Deleted ${localeDir.path}/${file}`)
                fs.unlinkSync(`${localeDir.path}/${file}`)
                delete localeDir.files[file]
            }
        }

        // if there are missing files, create them
        for(const file of files) {
            if(!Object.keys(localeDir.files).includes(file)) {
                console.info(`Created ${localeDir.path}/${file}`)
                fs.writeFileSync(`${localeDir.path}/${file}`, JSON.stringify({}))
                localeDir.files[file] = {}
            }
        }

        // if there are missing keys, create them
        for(const file of files) {
            syncKeys(localeDirs[0].files[file], localeDir.files[file])
        }

        // save the files
        for(const file of files) {
            fs.writeFileSync(`${localeDir.path}/${file}`, JSON.stringify(localeDir.files[file], null, 4))
        }
    }
}


// syncKeys is a helper function to sync keys between two objects.
// if a key exists in a but not b, it will be created in b,
// if a key exists in b but not a, it will be deleted in b.
const syncKeys = (a,b) => {
    const keys = Object.keys(a)
    for(const key of keys) {
        if(typeof a[key] === 'object') {
            if(typeof b[key] !== 'object') {
                b[key] = {}
            }
            syncKeys(a[key], b[key])
        } else {
            if(typeof b[key] === 'object') {
                b[key] = a[key]
            } else {
                if(!Object.keys(b).includes(key)) {
                    b[key] = a[key]
                }
            }
        }
    }
    for (const key of Object.keys(b)) {
        if (!keys.includes(key)) {
            delete b[key]
        }
    }
}

main().catch(e => console.error(e))
