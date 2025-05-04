import assert from 'node:assert';
import { Generator } from '..';
import { randomInt } from 'node:crypto';
import { selector } from './selection';


const subjects = ['quetzacoatl', 'coati', 'aye-aye', 'bush baby', 'slow loris', 'gorilla', 'ferret', 'phoenix', 'moose', 'panther', 'puma', 'fox', 'sloth', 'otter', 'butterfly', 'hippogriff', 'parrot', 'smilodon', 'mammoth', 'whale', 'octopus', 'hedgehog', 'raptor', 'hawk', 'eagle', 'owl', 'wolf', 'dog', 'bobcat', 'puppy', 'kitten', 'sheep','monocerus', 'prehistoric mammal', 'Bear', 'Bunny', 'Tiger', 'Lion', 'Pegasus', 'Dragon', '', 'Griffin', 'Narwhal', 'Rhinoceros', 'cat', 'Pegasus', 'Cheetah', 'Leopard', 'draft horse', 'dinosaur', 'hippo', 'mouse', 'capybara','koala', 'elephant', 'lamb','goat', 'pig'];
const adjectives = ['goth', 'disco', 'art deco', 'gothic', 'solar','lunar', 'solar', 'muscular', 'vibrant', 'vain', 'translucent', 'opalescent', 'pearlescent', 'scintillating', 'coruscating', 'ectoplasmic', 'midnight', 'infernal', 'crystalline', 'techno', '80s', '90s','fiery', 'fierce', 'cyperpunk', 'solarpunk', 'adorable','colorful','violently rainbow','vibrant', 'magical', 'pirate', 'heavy metal', 'kawaii', 'wintry', 'icy', 'hoary', 'silken', 'flowing', 'flowering', 'botanical', 'verdant', 'awe inspiring', 'pop', 'punk', 'alt', 'tattooed', 'metallic', 'metal', 'tiny', 'enormous', 'sylvan', 'Mighty', 'Glorious', 'Majestic', 'Noble','pastel', 'mother of pearl', 'tiny', 'pygmy','tribal', 'luminous', 'neon','squat', 'thicc', 'slender', 'smug', 'whimsical', 'serious', 'sleepy', 'fancy', 'suave', 'coquettish', 'arrogant', 'graceful', 'sepia', 'rainbow', 'Tie Dye', 'Sparkly', 'Glittery', 'Shiny', 'Pink', 'Purple', 'steampunk','soulful','gentle','happy','joyful', 'rampant', 'winking', 'rearing', 'flying', 'leafy', 'wavy', 'brilliant', 'shimmering', 'wild'];
const setting = ['at a rave','in an ice castle', 'atop a mountain', 'before a rainbowfall', 'in darkness visbible', 'illuminating the darkness', 'in a pool of moonlight', 'with neon lights', 'with lasers', 'surfacing', 'in a sea of stars', 'swimming', 'flying', 'galloping', 'in a herd', 'materializing', 'made of pastel cloud', 'surrounded by animal friends', 'among other mythic creatures', 'in a jungle', 'in a thunderstorm', 'Emerging from sea foam', 'with its\' family', 'in the rain', 'in a rainbowstorm', 'Frolicking', 'limned with fire', 'haloed by light', 'on a ray of sunshine', 'in space', 'running along a rainbow', 'in a nebula', 'descending from the clouds', 'with a lens flare', 'in the clouds', 'in a city', 'in a crowd', 'in front of a castle','in a forest','', 'in a cloud of bubbles', 'emerging from fog', 'romping', 'at a party', 'partying', 'having a tea party', 'in a volcano', 'flying out of an erupting volcano', 'in the clouds', 'in front of a castle made of clouds', 'emerging from the mist'];
const style = ['stained glass', 'stylized', 'Nepalese', 'ballhaus', 'buddhist', 'shinto', 'watercolor','portait', 'flemish', 'renaissance', 'stylized','medieval', 'aztecan', 'nordic', 'runic', 'tapestry','illuminated manuscript', 'japanese', 'chinese','korean', 'mayan', 'germanic', 'impressionist', 'native american', 'indian', 'hellenic', 'greek', 'roman', 'celtic', 'irish', 'scottish', 'tribal', 'maori', 'polynesian', 'hawaiian', 'iriquois', 'pueblan','inuit']

interface GenerateParams {
  entity: string,
  postscript: string
}

interface Selectors {
  subjects: string[],
  adjectives: string[],
  setting: string[],
  style: string[]
}

const generate = ({ subjects, adjectives, setting, style }: Selectors) => ({ entity, postscript }: GenerateParams) => async (acc: Generator) => {

  const selections = {
    subject: randomInt(2) > 1 ? `${selector(subjects)} ${entity}` : `${entity} ${selector(subjects)}`,
    adjectives: selector(adjectives, randomInt(3)),
    setting: selector(setting),
    style: selector(style)
  };

  acc.prompt ??= selections;
  acc.imageModel.input ??= { prompt: `${selections.adjectives}  ${selections.subject} ${selections.setting} in a ${selections.style} aesthetic/style. ${postscript}` }

 return acc;
}

const describe = (prompt: string) => async (acc: Generator) => {
  assert(acc.imageModel.output, `No valid image found for image model output. Value is ${acc.imageModel?.output}`);
  const imgB64 = acc.imageModel.output;

  acc.textModel.input ??= {
    prompt,
    imgB64
  };

  return acc;
}


export const prompt = {
  image: generate({ subjects, adjectives, setting, style }),
  text: describe(`You are a naturalist scientifically describing a mythical creature as though it were a real animal. This is a picture of a riff on a unicorn. It is ok to invent details here, as it will be presented as fictional. \n
            invent information about it in the following JSON format:
            {
              "name": '',
              "scientific_name": '',
              "habitat": '',
              "size": '',
              "coloration": '',
              "diet": '',
              "lifespan": '',
              "special_abilities": '',
              "fun_fact": ''
            }`)
};
