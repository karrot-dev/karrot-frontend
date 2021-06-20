import { generate } from '@mapbox/appropriate-images'
import sharp from 'sharp'
import { unlink, rename, readdirSync, readFileSync, writeFileSync } from 'fs'
import { extname, join, resolve } from 'path'
import { dirNames, dirs } from './images-config.mjs'

// unlike commonJS, there is no built-in "__dirname" in js modules
const __dirname = resolve()

const WEBP_REGEX = /webp$/i
const SQUARE_REGEX = /x[0-9]{1,5}/i

const BASE_OUTPUT_DIR = 'src/base/pages/images/'
const BASE_INPUT_DIR = BASE_OUTPUT_DIR + '_raws/'

const imageDirectories = Object.values(dirNames).map(dirName => {
  return {
    name: dirName,
    ...dirs[dirName],
  }
})

const printError = (errorMsg, prependErrorWord = false) => {
  const errorWord = prependErrorWord ? 'Error:' : ''
  console.error('\x1b[31m', errorWord, errorMsg, '\x1b[0m')
}

const generateResponsiveImages = async ({
  inputDirectory = '',
  outputDirectory = '',
  imagesAreSquare = false,
  mapboxImages = [],
} = {}) => {
  try {
    const output = await generate(mapboxImages, {
      inputDirectory,
      outputDirectory,
      mozjpeg: {
        quality: 90,
      },
      pngquant: {
        quality: [0.5, 0.9],
      },
    })
    const finalImagePaths = []
    output.forEach(imagePath => {
      // delete webp images
      if (WEBP_REGEX.test(imagePath)) {
        unlink(join(__dirname, imagePath), error => {
          if (error) throw error
        })
      }
      // rename square images
      else {
        if (imagesAreSquare) {
          const stringToDelete = imagePath.match(SQUARE_REGEX) // eg '.../image-600x600.jpg' -> stringToDelete would be 'x600'
          const newImagePath = imagePath.replace(stringToDelete[0], '') // -> '.../image-600.jpg'
          rename(imagePath, newImagePath, error => {
            if (error) throw error
          })
          finalImagePaths.push(newImagePath)
        }
        else {
          finalImagePaths.push(imagePath)
        }
      }
    })
    return finalImagePaths
  }
  catch (errors) {
    if (Array.isArray(errors)) {
      errors.forEach(err => console.error(err.stack))
    }
    else {
      console.error(errors.stack)
    }
  }
}

const checkImage = async (fileName, imageDir) => {
  const filePath = join(
    __dirname,
    `${BASE_INPUT_DIR}${imageDir.name}/${fileName}`,
  )
  const file = readFileSync(filePath)
  const ext = extname(filePath)

  const metadata = await sharp(file).metadata()
  let imageWarning

  if (imageDir.requiredImageDimensions) {
    if (imageDir.requiredImageDimensions.length !== 2) {
      throw new Error(
        `requiredImageDimensions needs two numbers in directory '${imageDir.name}'`,
      )
    }
    if (
      metadata.width !== imageDir.requiredImageDimensions[0] ||
      metadata.height !== imageDir.requiredImageDimensions[1]
    ) {
      throw new Error(
        `required images dimensions in directory '${imageDir.name}' are ${imageDir.requiredImageDimensions[0]}x${imageDir.requiredImageDimensions[1]} but got ${metadata.width}x${metadata.height} for image '${fileName}'`,
      )
    }
  }
  else {
    // collect warnings about low quality images
    let widthWarning = false
    let heightWarning = false

    if (metadata.width < imageDir.maxWidth) widthWarning = true
    if (metadata.height < imageDir.maxWidth) heightWarning = true

    if (widthWarning || heightWarning) {
      imageWarning = {
        imageName: fileName,
      }
      if (widthWarning) imageWarning.width = metadata.width
      if (heightWarning) imageWarning.height = metadata.height
    }
  }
  return { imageWarning, ext }
}

const run = async () => {
  const jsonContent = {}
  const sizeWarnings = []

  for (const imageDir of imageDirectories) {
    jsonContent[imageDir.name] = []

    const files = readdirSync(
      join(__dirname, `${BASE_INPUT_DIR}${imageDir.name}`),
    ).filter(file => file !== '.DS_Store')

    if (imageDir.requiredImages && imageDir.requiredImages.length > 0) {
      const countRequired = imageDir.requiredImages.length
      const countFiles = files.length
      if (countRequired !== countFiles) {
        const errorMsg = `${countFiles} images found but exactly ${countRequired} are required in directory '${imageDir.name}'`
        printError(errorMsg, true)
        throw new Error()
      }

      for (const requiredImg of imageDir.requiredImages) {
        const found = files.includes(requiredImg)
        if (!found) {
          const errorMsg = `not all required images found in directory '${imageDir.name}' -> check file names`
          printError(errorMsg, true)
          throw new Error()
        }
      }
    }

    const mapboxImages = {}

    for (const fileName of files) {
      let fileExtension = ''
      try {
        const { imageWarning, ext } = await checkImage(fileName, imageDir)
        fileExtension = ext
        if (imageWarning) {
          sizeWarnings.push(imageWarning)
        }
      }
      catch (errorMsg) {
        printError(errorMsg)
        throw new Error()
      }

      jsonContent[imageDir.name].push({
        baseFileName: fileName.replace(fileExtension, ''),
        ext: fileExtension,
      })

      mapboxImages[fileName] = {
        basename: fileName,
        sizes: imageDir.widths.map(w => {
          return imageDir.imagesAreSquare
            ? { width: w, height: w }
            : { width: w }
        }),
      }
    }

    const output = await generateResponsiveImages({
      inputDirectory: BASE_INPUT_DIR + imageDir.name,
      outputDirectory: BASE_OUTPUT_DIR + imageDir.name,
      imagesAreSquare: imageDir.imagesAreSquare,
      mapboxImages,
    })

    console.log(`Images generated for directory '${imageDir.name}':\n`, output)

    // add 'ratio' to each image object of jsonContent -> calculate from biggest generated image
    for (const imgEntry of jsonContent[imageDir.name]) {
      const fileNameBiggestImage = `${imgEntry.baseFileName}-${dirs[imageDir.name].maxWidth}${imgEntry.ext}`
      const file = readFileSync(join(__dirname, `${BASE_OUTPUT_DIR}${imageDir.name}/${fileNameBiggestImage}`))
      const metadata = await sharp(file).metadata()
      imgEntry.ratio = metadata.width / metadata.height
    }
  }

  if (sizeWarnings.length) {
    const warningHeadline = '\n\u26A0 WARNING'
    const warningDescription = 'The following images got scaled up to 600x600:'
    console.warn(`\x1b[33m\x1b[1m${warningHeadline}\x1b[0m`)
    console.warn(`\x1b[33m${warningDescription}\x1b[0m`)
    const warningItems = {}
    for (const warning of sizeWarnings) {
      warningItems[`\x1b[33m${warning.imageName}`] = {
        width: warning.width || '\u2713',
        height: warning.height || '\u2713',
      }
    }
    console.table(warningItems)
  }

  // create json-file with list of images per folder
  writeFileSync(join(__dirname, 'src/base/images.json'), JSON.stringify(jsonContent, null, 2))
}

run()
