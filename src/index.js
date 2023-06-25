const pug = require('pug');
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const cars = require('./cars');

function isUnique(arr, prop) {
  const values = arr.map(item => item[prop]);
  return new Set(values).size === arr.length;
}

function getTravel(category, name) {
  switch (category) {
    case "community": 
      return { banner: "/img/community.jpg", altBanner: "Journey Together, Create Lasting Memories!"}
    case "motorbike": 
      return { banner: "/img/motorbike.jpg", altBanner: "Ignite Adventure, Experience Bali Unbounded!"}
    case "luxury":
      return { banner: "/img/luxury.jpg", altBanner: "Elegance in Motion, Luxury in Every Journey!"}
    case "scooter":
      return { banner: "/img/scooter.jpg", altBanner: "Embrace the Breeze, Experience the Bliss!"}
    case "adventure": 
      return { banner: "/img/adventure.jpg", altBanner: "Adventure in Comfort, Explore Bali in Style!"}
    default:
      console.log(`Category "${category}" not found for: ${name}`);
      return { banner: "/img/default.jpg", altBanner: "Unforgettable Journeys, Unbeatable Rentals!"}

  }
}

async function asyncHandler() {
  const rental = cars.filter((car) => (!car.notForRent)).map((car) => { 
    const name = path.parse(car.image).name;
    return { 
      ...car, 
      originalImage: car.image,
      image: `/img/rental/${car.image}`,
      ogBanner: `${name}_600_315.jpg`,
      link: `${car.name.toLowerCase().trim().replace(/\s+/g, '-')}.html`,
      message: encodeURI(`I am interested in renting your ${car.name}`)
    }
  });
  const selling = cars.filter((car) => (!car.notForSell)).map((car) => ({
    ...car,
    originalImage: car.image,
    image: `/img/rental/${car.image}`,
    message: encodeURI(`I am interested in buying your ${car.name}`)
  }))
  if (!isUnique(rental, "link")) {
    throw new Error("Duplicate links");
  }

  const basedir = path.join(__dirname, '..', 'templates');
  const imageSourceDir = path.join(__dirname, 'rental');
  const imageTargetDir = path.join(__dirname, '..', 'docs', 'img', 'rental');
  const rentalDir = path.join(__dirname, '..', 'docs', 'rental');
  const sellingDir = path.join(__dirname, '..', 'docs');
  fs.mkdirSync(rentalDir, { recursive: true });
  fs.mkdirSync(sellingDir, { recursive: true });
  fs.mkdirSync(imageTargetDir, { recursive: true });

  const compileRental = pug.compileFile(path.join(basedir, 'rentals.pug'), { basedir });
  const compileSelling = pug.compileFile(path.join(basedir, 'selling.pug'), { basedir });

  const html1 = compileRental({
    title: 'Rental',
    overview: rental,
    myOgUrl: "/rental/index.html",
    myOgTitle: "Car Rental",
    myOgDescription: "Drive Your Dream: Bali Awaits with Our Premier Car Rentals!",
    myOgImage: "/img/rental_1200_630.jpg"
  });
  const html2 = compileSelling({
    title: 'Selling',
    overview: selling,
    myOgUrl: "/selling.html",
    myOgTitle: "Car Selling",
    myOgDescription: "Drive Home Happiness: Your Perfect Car, Your Ultimate Journey!",
    myOgImage: "/img/selling_1200_630.jpg"
  });

  fs.writeFileSync(path.join(rentalDir, 'index.html'), html1);
  fs.writeFileSync(path.join(sellingDir, 'selling.html'), html2);

  for (const rentalCar of rental) {
    const { travel, name, originalImage, ogBanner } = rentalCar;
    const source = path.join(imageSourceDir, originalImage);
    if(fs.existsSync(source)) {
      const name = path.parse(originalImage).name;
      const target = path.join(imageTargetDir, originalImage);
      fs.copyFileSync(source, target);
      const ogTarget = path.join(imageTargetDir, ogBanner);
      await sharp(source)
        .resize({width: 600, height: 315})
        .flatten({ background: '#33cdcd' })
        .toFormat("jpeg")
        .toFile(ogTarget);
    } else {
      console.log(`Image missing for ${name}`);
    }
    const { banner, altBanner } = getTravel(travel, name);
    const compileCar = pug.compileFile(path.join(basedir, 'car.pug'), { basedir });
    const html3 = compileCar({
      myTitle: rentalCar.name,
      link: rentalCar.link,
      image: rentalCar.image ,
      name: rentalCar.name,
      withDriver: rentalCar.withDriver,
      withDrinks: rentalCar.withDrinks,
      duration: rentalCar.duration,
      price: rentalCar.price,
      text: rentalCar.text,
      banner,
      altBanner,
      myOgUrl: `/rental/${rentalCar.link}`,
      myOgTitle: `Rent a ${rentalCar.name}`,
      myOgDescription: altBanner,
      myOgImage: `/img/rental/${rentalCar.ogBanner}`,
      message: rentalCar.message
    });
    fs.writeFileSync(path.join(rentalDir, rentalCar.link), html3);
  }
}
void asyncHandler();
