import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUTPUT_DIR = path.resolve(__dirname, '../public/assets/data');
const IMAGES_DIR = path.resolve(__dirname, '../public/assets/images/thumbs');

const PLANTS = [
  { latinName: 'Tulipa gesneriana', dutchName: 'Tulp', category: 'flower', family: 'Liliaceae', bloom: 'Lente', height: '20-60 cm', sun: 'Volle zon', water: 'Gemiddeld', hardiness: 'Matig', nativeRange: ['Centraal-Azie', 'Europa'] },
  { latinName: 'Narcissus pseudonarcissus', dutchName: 'Narcis', category: 'flower', family: 'Amaryllidaceae', bloom: 'Vroege lente', height: '20-45 cm', sun: 'Zon-halfschaduw', water: 'Gemiddeld', hardiness: 'Goed', nativeRange: ['West-Europa'] },
  { latinName: 'Hyacinthus orientalis', dutchName: 'Hyacint', category: 'flower', family: 'Asparagaceae', bloom: 'Lente', height: '15-30 cm', sun: 'Zon-halfschaduw', water: 'Gemiddeld', hardiness: 'Matig', nativeRange: ['Oost-Middellandse Zee'] },
  { latinName: 'Crocus vernus', dutchName: 'Krokus', category: 'flower', family: 'Iridaceae', bloom: 'Vroege lente', height: '8-15 cm', sun: 'Zon-halfschaduw', water: 'Laag', hardiness: 'Goed', nativeRange: ['Europa'] },
  { latinName: 'Convallaria majalis', dutchName: 'Lelietje-van-dalen', category: 'flower', family: 'Asparagaceae', bloom: 'Lente', height: '15-25 cm', sun: 'Halfschaduw', water: 'Gemiddeld', hardiness: 'Goed', nativeRange: ['Europa', 'Azie'] },
  { latinName: 'Quercus robur', dutchName: 'Zomereik', category: 'tree', family: 'Fagaceae', bloom: 'Lente', height: '20-40 m', sun: 'Volle zon', water: 'Gemiddeld', hardiness: 'Uitstekend', nativeRange: ['Europa'] },
  { latinName: 'Fagus sylvatica', dutchName: 'Beuk', category: 'tree', family: 'Fagaceae', bloom: 'Lente', height: '25-40 m', sun: 'Zon-halfschaduw', water: 'Gemiddeld', hardiness: 'Goed', nativeRange: ['Europa'] },
  { latinName: 'Urtica dioica', dutchName: 'Brandnetel', category: 'herb', family: 'Urticaceae', bloom: 'Zomer', height: '30-150 cm', sun: 'Zon-halfschaduw', water: 'Hoog', hardiness: 'Uitstekend', nativeRange: ['Europa', 'Azie'] },
  { latinName: 'Taraxacum officinale', dutchName: 'Paardenbloem', category: 'herb', family: 'Asteraceae', bloom: 'Lente-zomer', height: '10-40 cm', sun: 'Volle zon', water: 'Laag', hardiness: 'Uitstekend', nativeRange: ['Europa'] },
  { latinName: 'Plantago major', dutchName: 'Grote weegbree', category: 'herb', family: 'Plantaginaceae', bloom: 'Zomer', height: '10-50 cm', sun: 'Zon-halfschaduw', water: 'Gemiddeld', hardiness: 'Uitstekend', nativeRange: ['Europa', 'Azie'] },
  { latinName: 'Helianthus annuus', dutchName: 'Zonnebloem', category: 'flower', family: 'Asteraceae', bloom: 'Zomer', height: '1-3 m', sun: 'Volle zon', water: 'Gemiddeld', hardiness: 'Gevoelig', nativeRange: ['Noord-Amerika'] },
  { latinName: 'Trifolium repens', dutchName: 'Witte klaver', category: 'herb', family: 'Fabaceae', bloom: 'Lente-zomer', height: '5-20 cm', sun: 'Zon-halfschaduw', water: 'Gemiddeld', hardiness: 'Goed', nativeRange: ['Europa'] },
  { latinName: 'Bellis perennis', dutchName: 'Madeliefje', category: 'flower', family: 'Asteraceae', bloom: 'Lente-herfst', height: '5-20 cm', sun: 'Zon-halfschaduw', water: 'Gemiddeld', hardiness: 'Goed', nativeRange: ['Europa'] },
  { latinName: 'Rosa canina', dutchName: 'Hondsroos', category: 'shrub', family: 'Rosaceae', bloom: 'Lente-zomer', height: '1-3 m', sun: 'Volle zon', water: 'Laag', hardiness: 'Goed', nativeRange: ['Europa', 'West-Azie'] },
  { latinName: 'Acer platanoides', dutchName: 'Noorse esdoorn', category: 'tree', family: 'Sapindaceae', bloom: 'Lente', height: '20-30 m', sun: 'Zon-halfschaduw', water: 'Gemiddeld', hardiness: 'Goed', nativeRange: ['Europa'] },
  { latinName: 'Betula pendula', dutchName: 'Ruwe berk', category: 'tree', family: 'Betulaceae', bloom: 'Lente', height: '15-25 m', sun: 'Volle zon', water: 'Laag', hardiness: 'Uitstekend', nativeRange: ['Europa', 'Azie'] },
  { latinName: 'Salix alba', dutchName: 'Witte wilg', category: 'tree', family: 'Salicaceae', bloom: 'Lente', height: '20-30 m', sun: 'Volle zon', water: 'Hoog', hardiness: 'Goed', nativeRange: ['Europa'] },
  { latinName: 'Prunus avium', dutchName: 'Zoete kers', category: 'tree', family: 'Rosaceae', bloom: 'Lente', height: '15-25 m', sun: 'Volle zon', water: 'Gemiddeld', hardiness: 'Goed', nativeRange: ['Europa'] },
  { latinName: 'Sambucus nigra', dutchName: 'Vlier', category: 'shrub', family: 'Adoxaceae', bloom: 'Lente-zomer', height: '3-7 m', sun: 'Zon-halfschaduw', water: 'Gemiddeld', hardiness: 'Goed', nativeRange: ['Europa'] },
  { latinName: 'Crataegus monogyna', dutchName: 'Eenstijlige meidoorn', category: 'shrub', family: 'Rosaceae', bloom: 'Lente', height: '2-8 m', sun: 'Volle zon', water: 'Laag', hardiness: 'Uitstekend', nativeRange: ['Europa'] },
  { latinName: 'Alnus glutinosa', dutchName: 'Zwarte els', category: 'tree', family: 'Betulaceae', bloom: 'Lente', height: '20-30 m', sun: 'Zon-halfschaduw', water: 'Hoog', hardiness: 'Goed', nativeRange: ['Europa'] },
  { latinName: 'Frangula alnus', dutchName: 'Sporkehout', category: 'shrub', family: 'Rhamnaceae', bloom: 'Zomer', height: '2-5 m', sun: 'Zon-halfschaduw', water: 'Gemiddeld', hardiness: 'Goed', nativeRange: ['Europa'] },
  { latinName: 'Rumex obtusifolius', dutchName: 'Ridderzuring', category: 'herb', family: 'Polygonaceae', bloom: 'Zomer', height: '50-120 cm', sun: 'Zon-halfschaduw', water: 'Gemiddeld', hardiness: 'Uitstekend', nativeRange: ['Europa'] },
  { latinName: 'Centaurea cyanus', dutchName: 'Korenbloem', category: 'flower', family: 'Asteraceae', bloom: 'Zomer', height: '30-80 cm', sun: 'Volle zon', water: 'Laag', hardiness: 'Matig', nativeRange: ['Europa'] },
  { latinName: 'Papaver rhoeas', dutchName: 'Klaproos', category: 'flower', family: 'Papaveraceae', bloom: 'Zomer', height: '30-70 cm', sun: 'Volle zon', water: 'Laag', hardiness: 'Matig', nativeRange: ['Europa'] },
  { latinName: 'Achillea millefolium', dutchName: 'Duizendblad', category: 'herb', family: 'Asteraceae', bloom: 'Zomer', height: '20-80 cm', sun: 'Volle zon', water: 'Laag', hardiness: 'Goed', nativeRange: ['Europa', 'Azie'] },
  { latinName: 'Ranunculus acris', dutchName: 'Scherpe boterbloem', category: 'flower', family: 'Ranunculaceae', bloom: 'Lente-zomer', height: '30-90 cm', sun: 'Zon-halfschaduw', water: 'Gemiddeld', hardiness: 'Goed', nativeRange: ['Europa'] },
  { latinName: 'Primula vulgaris', dutchName: 'Sleutelbloem', category: 'flower', family: 'Primulaceae', bloom: 'Vroege lente', height: '10-25 cm', sun: 'Halfschaduw', water: 'Gemiddeld', hardiness: 'Goed', nativeRange: ['Europa'] },
  { latinName: 'Viola odorata', dutchName: 'Maarts viooltje', category: 'flower', family: 'Violaceae', bloom: 'Vroege lente', height: '5-15 cm', sun: 'Halfschaduw', water: 'Gemiddeld', hardiness: 'Goed', nativeRange: ['Europa'] },
  { latinName: 'Lamium album', dutchName: 'Witte dovenetel', category: 'herb', family: 'Lamiaceae', bloom: 'Lente-herfst', height: '20-60 cm', sun: 'Halfschaduw', water: 'Gemiddeld', hardiness: 'Goed', nativeRange: ['Europa', 'Azie'] },
  { latinName: 'Digitalis purpurea', dutchName: 'Vingerhoedskruid', category: 'flower', family: 'Plantaginaceae', bloom: 'Zomer', height: '60-150 cm', sun: 'Halfschaduw', water: 'Gemiddeld', hardiness: 'Matig', nativeRange: ['West-Europa'] },
  { latinName: 'Hypericum perforatum', dutchName: 'Sint-janskruid', category: 'herb', family: 'Hypericaceae', bloom: 'Zomer', height: '30-90 cm', sun: 'Volle zon', water: 'Laag', hardiness: 'Goed', nativeRange: ['Europa'] },
  { latinName: 'Matricaria chamomilla', dutchName: 'Echte kamille', category: 'herb', family: 'Asteraceae', bloom: 'Zomer', height: '15-50 cm', sun: 'Volle zon', water: 'Laag', hardiness: 'Matig', nativeRange: ['Europa'] },
  { latinName: 'Calendula officinalis', dutchName: 'Goudsbloem', category: 'flower', family: 'Asteraceae', bloom: 'Zomer-herfst', height: '30-60 cm', sun: 'Volle zon', water: 'Gemiddeld', hardiness: 'Matig', nativeRange: ['Middellandse Zee'] },
  { latinName: 'Lavandula angustifolia', dutchName: 'Lavendel', category: 'shrub', family: 'Lamiaceae', bloom: 'Zomer', height: '30-70 cm', sun: 'Volle zon', water: 'Laag', hardiness: 'Matig', nativeRange: ['Zuid-Europa'] },
  { latinName: 'Salvia officinalis', dutchName: 'Salie', category: 'shrub', family: 'Lamiaceae', bloom: 'Zomer', height: '30-70 cm', sun: 'Volle zon', water: 'Laag', hardiness: 'Matig', nativeRange: ['Middellandse Zee'] },
  { latinName: 'Thymus vulgaris', dutchName: 'Tijm', category: 'shrub', family: 'Lamiaceae', bloom: 'Zomer', height: '10-30 cm', sun: 'Volle zon', water: 'Laag', hardiness: 'Matig', nativeRange: ['Zuid-Europa'] },
  { latinName: 'Origanum vulgare', dutchName: 'Oregano', category: 'herb', family: 'Lamiaceae', bloom: 'Zomer', height: '30-80 cm', sun: 'Volle zon', water: 'Laag', hardiness: 'Goed', nativeRange: ['Europa'] },
  { latinName: 'Mentha aquatica', dutchName: 'Watermunt', category: 'herb', family: 'Lamiaceae', bloom: 'Zomer', height: '30-90 cm', sun: 'Zon-halfschaduw', water: 'Hoog', hardiness: 'Goed', nativeRange: ['Europa'] },
  { latinName: 'Melissa officinalis', dutchName: 'Citroenmelisse', category: 'herb', family: 'Lamiaceae', bloom: 'Zomer', height: '30-80 cm', sun: 'Zon-halfschaduw', water: 'Gemiddeld', hardiness: 'Goed', nativeRange: ['Zuid-Europa'] },
  { latinName: 'Rosmarinus officinalis', dutchName: 'Rozemarijn', category: 'shrub', family: 'Lamiaceae', bloom: 'Lente-zomer', height: '50-150 cm', sun: 'Volle zon', water: 'Laag', hardiness: 'Gevoelig', nativeRange: ['Middellandse Zee'] },
  { latinName: 'Artemisia absinthium', dutchName: 'Absintalsem', category: 'herb', family: 'Asteraceae', bloom: 'Zomer', height: '60-120 cm', sun: 'Volle zon', water: 'Laag', hardiness: 'Goed', nativeRange: ['Europa', 'Azie'] },
  { latinName: 'Echinacea purpurea', dutchName: 'Rode zonnehoed', category: 'flower', family: 'Asteraceae', bloom: 'Zomer', height: '60-120 cm', sun: 'Volle zon', water: 'Gemiddeld', hardiness: 'Goed', nativeRange: ['Noord-Amerika'] },
  { latinName: 'Valeriana officinalis', dutchName: 'Valeriaan', category: 'herb', family: 'Caprifoliaceae', bloom: 'Zomer', height: '80-150 cm', sun: 'Zon-halfschaduw', water: 'Gemiddeld', hardiness: 'Goed', nativeRange: ['Europa'] },
  { latinName: 'Verbena officinalis', dutchName: 'Ijzerhard', category: 'herb', family: 'Verbenaceae', bloom: 'Zomer', height: '30-80 cm', sun: 'Volle zon', water: 'Laag', hardiness: 'Goed', nativeRange: ['Europa'] },
  { latinName: 'Malva sylvestris', dutchName: 'Groot kaasjeskruid', category: 'flower', family: 'Malvaceae', bloom: 'Zomer-herfst', height: '30-120 cm', sun: 'Volle zon', water: 'Gemiddeld', hardiness: 'Goed', nativeRange: ['Europa'] },
  { latinName: 'Cichorium intybus', dutchName: 'Wilde cichorei', category: 'herb', family: 'Asteraceae', bloom: 'Zomer', height: '30-120 cm', sun: 'Volle zon', water: 'Laag', hardiness: 'Goed', nativeRange: ['Europa'] },
  { latinName: 'Chelidonium majus', dutchName: 'Stinkende gouwe', category: 'herb', family: 'Papaveraceae', bloom: 'Lente-zomer', height: '30-90 cm', sun: 'Halfschaduw', water: 'Gemiddeld', hardiness: 'Goed', nativeRange: ['Europa'] },
  { latinName: 'Geranium robertianum', dutchName: 'Robertskruid', category: 'herb', family: 'Geraniaceae', bloom: 'Lente-zomer', height: '20-50 cm', sun: 'Halfschaduw', water: 'Gemiddeld', hardiness: 'Goed', nativeRange: ['Europa'] },
  { latinName: 'Poa pratensis', dutchName: 'Veldbeemdgras', category: 'grass', family: 'Poaceae', bloom: 'Lente-zomer', height: '30-90 cm', sun: 'Volle zon', water: 'Gemiddeld', hardiness: 'Uitstekend', nativeRange: ['Europa', 'Azie'] },
  { latinName: 'Dactylis glomerata', dutchName: 'Kropaar', category: 'grass', family: 'Poaceae', bloom: 'Lente-zomer', height: '40-120 cm', sun: 'Volle zon', water: 'Gemiddeld', hardiness: 'Uitstekend', nativeRange: ['Europa'] },
  { latinName: 'Lolium perenne', dutchName: 'Engels raaigras', category: 'grass', family: 'Poaceae', bloom: 'Lente-zomer', height: '20-70 cm', sun: 'Volle zon', water: 'Gemiddeld', hardiness: 'Uitstekend', nativeRange: ['Europa'] },
  { latinName: 'Festuca rubra', dutchName: 'Rood zwenkgras', category: 'grass', family: 'Poaceae', bloom: 'Zomer', height: '20-80 cm', sun: 'Zon-halfschaduw', water: 'Laag', hardiness: 'Uitstekend', nativeRange: ['Europa'] },
  { latinName: 'Phleum pratense', dutchName: 'Timotheegras', category: 'grass', family: 'Poaceae', bloom: 'Zomer', height: '50-120 cm', sun: 'Volle zon', water: 'Gemiddeld', hardiness: 'Goed', nativeRange: ['Europa'] },
  { latinName: 'Deschampsia cespitosa', dutchName: 'Ruwe smele', category: 'grass', family: 'Poaceae', bloom: 'Zomer', height: '50-150 cm', sun: 'Zon-halfschaduw', water: 'Hoog', hardiness: 'Goed', nativeRange: ['Europa'] },
  { latinName: 'Carex acutiformis', dutchName: 'Moeraszegge', category: 'grass', family: 'Cyperaceae', bloom: 'Lente', height: '50-120 cm', sun: 'Zon-halfschaduw', water: 'Hoog', hardiness: 'Goed', nativeRange: ['Europa'] },
  { latinName: 'Juncus effusus', dutchName: 'Pitrus', category: 'grass', family: 'Juncaceae', bloom: 'Zomer', height: '40-120 cm', sun: 'Zon-halfschaduw', water: 'Hoog', hardiness: 'Goed', nativeRange: ['Europa'] },
  { latinName: 'Phragmites australis', dutchName: 'Riet', category: 'grass', family: 'Poaceae', bloom: 'Zomer', height: '150-400 cm', sun: 'Volle zon', water: 'Hoog', hardiness: 'Goed', nativeRange: ['Wereldwijd'] },
  { latinName: 'Molinia caerulea', dutchName: 'Pijpenstrootje', category: 'grass', family: 'Poaceae', bloom: 'Zomer', height: '40-150 cm', sun: 'Zon-halfschaduw', water: 'Gemiddeld', hardiness: 'Goed', nativeRange: ['Europa'] },
  { latinName: 'Dryopteris filix-mas', dutchName: 'Mannetjesvaren', category: 'fern', family: 'Dryopteridaceae', bloom: 'Geen bloemen', height: '40-120 cm', sun: 'Schaduw-halfschaduw', water: 'Gemiddeld', hardiness: 'Goed', nativeRange: ['Europa'] },
  { latinName: 'Pteridium aquilinum', dutchName: 'Adelaarsvaren', category: 'fern', family: 'Dennstaedtiaceae', bloom: 'Geen bloemen', height: '60-200 cm', sun: 'Zon-halfschaduw', water: 'Laag', hardiness: 'Goed', nativeRange: ['Wereldwijd'] },
  { latinName: 'Athyrium filix-femina', dutchName: 'Wijfjesvaren', category: 'fern', family: 'Athyriaceae', bloom: 'Geen bloemen', height: '50-120 cm', sun: 'Schaduw-halfschaduw', water: 'Gemiddeld', hardiness: 'Goed', nativeRange: ['Europa'] },
  { latinName: 'Polypodium vulgare', dutchName: 'Eikvaren', category: 'fern', family: 'Polypodiaceae', bloom: 'Geen bloemen', height: '10-40 cm', sun: 'Schaduw-halfschaduw', water: 'Gemiddeld', hardiness: 'Goed', nativeRange: ['Europa'] },
  { latinName: 'Asplenium scolopendrium', dutchName: 'Tongvaren', category: 'fern', family: 'Aspleniaceae', bloom: 'Geen bloemen', height: '20-60 cm', sun: 'Schaduw-halfschaduw', water: 'Gemiddeld', hardiness: 'Goed', nativeRange: ['Europa'] },
  { latinName: 'Pinus sylvestris', dutchName: 'Grove den', category: 'tree', family: 'Pinaceae', bloom: 'Lente', height: '20-35 m', sun: 'Volle zon', water: 'Laag', hardiness: 'Uitstekend', nativeRange: ['Europa', 'Azie'] },
  { latinName: 'Picea abies', dutchName: 'Fijnspar', category: 'tree', family: 'Pinaceae', bloom: 'Lente', height: '30-50 m', sun: 'Volle zon', water: 'Gemiddeld', hardiness: 'Goed', nativeRange: ['Noord-Europa'] },
  { latinName: 'Abies alba', dutchName: 'Zilverspar', category: 'tree', family: 'Pinaceae', bloom: 'Lente', height: '30-50 m', sun: 'Zon-halfschaduw', water: 'Gemiddeld', hardiness: 'Goed', nativeRange: ['Europa'] },
  { latinName: 'Larix decidua', dutchName: 'Europese lariks', category: 'tree', family: 'Pinaceae', bloom: 'Lente', height: '20-40 m', sun: 'Volle zon', water: 'Gemiddeld', hardiness: 'Goed', nativeRange: ['Centraal-Europa'] },
  { latinName: 'Taxus baccata', dutchName: 'Venijnboom', category: 'tree', family: 'Taxaceae', bloom: 'Lente', height: '10-20 m', sun: 'Schaduw-halfschaduw', water: 'Gemiddeld', hardiness: 'Goed', nativeRange: ['Europa'] },
  { latinName: 'Juniperus communis', dutchName: 'Jeneverbes', category: 'shrub', family: 'Cupressaceae', bloom: 'Lente', height: '1-10 m', sun: 'Volle zon', water: 'Laag', hardiness: 'Goed', nativeRange: ['Noordelijk halfrond'] },
  { latinName: 'Corylus avellana', dutchName: 'Hazelaar', category: 'shrub', family: 'Betulaceae', bloom: 'Vroege lente', height: '3-8 m', sun: 'Zon-halfschaduw', water: 'Gemiddeld', hardiness: 'Goed', nativeRange: ['Europa'] },
  { latinName: 'Ilex aquifolium', dutchName: 'Hulst', category: 'shrub', family: 'Aquifoliaceae', bloom: 'Lente', height: '2-10 m', sun: 'Schaduw-halfschaduw', water: 'Gemiddeld', hardiness: 'Goed', nativeRange: ['Europa'] },
  { latinName: 'Buxus sempervirens', dutchName: 'Buxus', category: 'shrub', family: 'Buxaceae', bloom: 'Lente', height: '1-5 m', sun: 'Zon-halfschaduw', water: 'Gemiddeld', hardiness: 'Matig', nativeRange: ['Europa'] },
  { latinName: 'Ligustrum vulgare', dutchName: 'Wilde liguster', category: 'shrub', family: 'Oleaceae', bloom: 'Zomer', height: '2-5 m', sun: 'Zon-halfschaduw', water: 'Gemiddeld', hardiness: 'Goed', nativeRange: ['Europa'] },
  { latinName: 'Viburnum opulus', dutchName: 'Gelderse roos', category: 'shrub', family: 'Adoxaceae', bloom: 'Lente-zomer', height: '2-5 m', sun: 'Zon-halfschaduw', water: 'Gemiddeld', hardiness: 'Goed', nativeRange: ['Europa'] },
  { latinName: 'Cornus sanguinea', dutchName: 'Rode kornoelje', category: 'shrub', family: 'Cornaceae', bloom: 'Lente-zomer', height: '2-5 m', sun: 'Zon-halfschaduw', water: 'Gemiddeld', hardiness: 'Goed', nativeRange: ['Europa'] },
  { latinName: 'Euonymus europaeus', dutchName: 'Kardinaalsmuts', category: 'shrub', family: 'Celastraceae', bloom: 'Lente', height: '2-6 m', sun: 'Zon-halfschaduw', water: 'Gemiddeld', hardiness: 'Goed', nativeRange: ['Europa'] },
  { latinName: 'Prunus spinosa', dutchName: 'Sleedoorn', category: 'shrub', family: 'Rosaceae', bloom: 'Vroege lente', height: '2-5 m', sun: 'Volle zon', water: 'Laag', hardiness: 'Goed', nativeRange: ['Europa'] },
  { latinName: 'Rubus fruticosus', dutchName: 'Braam', category: 'shrub', family: 'Rosaceae', bloom: 'Zomer', height: '1-3 m', sun: 'Zon-halfschaduw', water: 'Gemiddeld', hardiness: 'Uitstekend', nativeRange: ['Europa'] },
  { latinName: 'Rubus idaeus', dutchName: 'Framboos', category: 'shrub', family: 'Rosaceae', bloom: 'Lente-zomer', height: '1-2 m', sun: 'Volle zon', water: 'Gemiddeld', hardiness: 'Goed', nativeRange: ['Europa'] },
  { latinName: 'Malus domestica', dutchName: 'Appelboom', category: 'tree', family: 'Rosaceae', bloom: 'Lente', height: '3-10 m', sun: 'Volle zon', water: 'Gemiddeld', hardiness: 'Goed', nativeRange: ['Gecultiveerd'] },
  { latinName: 'Pyrus communis', dutchName: 'Perenboom', category: 'tree', family: 'Rosaceae', bloom: 'Lente', height: '4-12 m', sun: 'Volle zon', water: 'Gemiddeld', hardiness: 'Goed', nativeRange: ['Europa'] },
  { latinName: 'Prunus domestica', dutchName: 'Pruimenboom', category: 'tree', family: 'Rosaceae', bloom: 'Lente', height: '4-10 m', sun: 'Volle zon', water: 'Gemiddeld', hardiness: 'Goed', nativeRange: ['Europa', 'Azie'] },
  { latinName: 'Juglans regia', dutchName: 'Walnoot', category: 'tree', family: 'Juglandaceae', bloom: 'Lente', height: '15-25 m', sun: 'Volle zon', water: 'Gemiddeld', hardiness: 'Matig', nativeRange: ['Zuid-Europa', 'West-Azie'] },
  { latinName: 'Castanea sativa', dutchName: 'Tamme kastanje', category: 'tree', family: 'Fagaceae', bloom: 'Zomer', height: '20-30 m', sun: 'Volle zon', water: 'Gemiddeld', hardiness: 'Matig', nativeRange: ['Zuid-Europa'] },
  { latinName: 'Tilia cordata', dutchName: 'Winterlinde', category: 'tree', family: 'Malvaceae', bloom: 'Zomer', height: '20-30 m', sun: 'Zon-halfschaduw', water: 'Gemiddeld', hardiness: 'Goed', nativeRange: ['Europa'] },
  { latinName: 'Ulmus minor', dutchName: 'Veldiep', category: 'tree', family: 'Ulmaceae', bloom: 'Vroege lente', height: '20-30 m', sun: 'Zon-halfschaduw', water: 'Gemiddeld', hardiness: 'Goed', nativeRange: ['Europa'] },
  { latinName: 'Fraxinus excelsior', dutchName: 'Gewone es', category: 'tree', family: 'Oleaceae', bloom: 'Lente', height: '20-40 m', sun: 'Zon-halfschaduw', water: 'Gemiddeld', hardiness: 'Goed', nativeRange: ['Europa'] },
  { latinName: 'Populus tremula', dutchName: 'Ratelpopulier', category: 'tree', family: 'Salicaceae', bloom: 'Lente', height: '15-25 m', sun: 'Volle zon', water: 'Gemiddeld', hardiness: 'Uitstekend', nativeRange: ['Europa', 'Azie'] },
  { latinName: 'Sorbus aucuparia', dutchName: 'Lijsterbes', category: 'tree', family: 'Rosaceae', bloom: 'Lente-zomer', height: '8-15 m', sun: 'Zon-halfschaduw', water: 'Gemiddeld', hardiness: 'Goed', nativeRange: ['Europa'] },
  { latinName: 'Lilium candidum', dutchName: 'Witte lelie', category: 'flower', family: 'Liliaceae', bloom: 'Zomer', height: '60-120 cm', sun: 'Volle zon', water: 'Gemiddeld', hardiness: 'Matig', nativeRange: ['Balkan', 'Midden-Oosten'] },
  { latinName: 'Iris pseudacorus', dutchName: 'Gele lis', category: 'flower', family: 'Iridaceae', bloom: 'Lente-zomer', height: '60-120 cm', sun: 'Volle zon', water: 'Hoog', hardiness: 'Goed', nativeRange: ['Europa'] },
  { latinName: 'Anemone nemorosa', dutchName: 'Bosanemoon', category: 'flower', family: 'Ranunculaceae', bloom: 'Vroege lente', height: '10-25 cm', sun: 'Halfschaduw', water: 'Gemiddeld', hardiness: 'Goed', nativeRange: ['Europa'] },
  { latinName: 'Leucanthemum vulgare', dutchName: 'Margriet', category: 'flower', family: 'Asteraceae', bloom: 'Zomer', height: '30-80 cm', sun: 'Volle zon', water: 'Gemiddeld', hardiness: 'Goed', nativeRange: ['Europa'] },
  { latinName: 'Knautia arvensis', dutchName: 'Beemdkroon', category: 'flower', family: 'Caprifoliaceae', bloom: 'Zomer', height: '30-100 cm', sun: 'Volle zon', water: 'Laag', hardiness: 'Goed', nativeRange: ['Europa'] },
  { latinName: 'Silene dioica', dutchName: 'Dagkoekoeksbloem', category: 'flower', family: 'Caryophyllaceae', bloom: 'Lente-zomer', height: '30-90 cm', sun: 'Zon-halfschaduw', water: 'Gemiddeld', hardiness: 'Goed', nativeRange: ['Europa'] },
  { latinName: 'Campanula rotundifolia', dutchName: 'Grasklokje', category: 'flower', family: 'Campanulaceae', bloom: 'Zomer', height: '15-50 cm', sun: 'Volle zon', water: 'Laag', hardiness: 'Goed', nativeRange: ['Europa'] },
  { latinName: 'Aquilegia vulgaris', dutchName: 'Akelei', category: 'flower', family: 'Ranunculaceae', bloom: 'Lente-zomer', height: '40-90 cm', sun: 'Halfschaduw', water: 'Gemiddeld', hardiness: 'Goed', nativeRange: ['Europa'] },
  { latinName: 'Helleborus foetidus', dutchName: 'Stinkend nieskruid', category: 'flower', family: 'Ranunculaceae', bloom: 'Winter-lente', height: '30-80 cm', sun: 'Halfschaduw', water: 'Gemiddeld', hardiness: 'Goed', nativeRange: ['West-Europa'] },
  { latinName: 'Myosotis arvensis', dutchName: 'Akkervergeet-mij-nietje', category: 'flower', family: 'Boraginaceae', bloom: 'Lente-zomer', height: '10-40 cm', sun: 'Zon-halfschaduw', water: 'Gemiddeld', hardiness: 'Goed', nativeRange: ['Europa'] },
  { latinName: 'Allium ursinum', dutchName: 'Daslook', category: 'herb', family: 'Amaryllidaceae', bloom: 'Lente', height: '20-50 cm', sun: 'Halfschaduw', water: 'Gemiddeld', hardiness: 'Goed', nativeRange: ['Europa'] },
  { latinName: 'Arum maculatum', dutchName: 'Gevlekte aronskelk', category: 'herb', family: 'Araceae', bloom: 'Lente', height: '20-40 cm', sun: 'Halfschaduw', water: 'Gemiddeld', hardiness: 'Goed', nativeRange: ['Europa'] },
  { latinName: 'Lysimachia nummularia', dutchName: 'Penningkruid', category: 'herb', family: 'Primulaceae', bloom: 'Zomer', height: '5-15 cm', sun: 'Zon-halfschaduw', water: 'Hoog', hardiness: 'Goed', nativeRange: ['Europa'] },
  { latinName: 'Filipendula ulmaria', dutchName: 'Moerasspirea', category: 'herb', family: 'Rosaceae', bloom: 'Zomer', height: '60-150 cm', sun: 'Zon-halfschaduw', water: 'Hoog', hardiness: 'Goed', nativeRange: ['Europa'] },
  { latinName: 'Lythrum salicaria', dutchName: 'Grote kattenstaart', category: 'flower', family: 'Lythraceae', bloom: 'Zomer', height: '60-150 cm', sun: 'Volle zon', water: 'Hoog', hardiness: 'Goed', nativeRange: ['Europa'] },
  { latinName: 'Dipsacus fullonum', dutchName: 'Grote kaardebol', category: 'herb', family: 'Caprifoliaceae', bloom: 'Zomer', height: '100-200 cm', sun: 'Volle zon', water: 'Laag', hardiness: 'Goed', nativeRange: ['Europa'] },
  { latinName: 'Verbascum thapsus', dutchName: 'Toorts', category: 'herb', family: 'Scrophulariaceae', bloom: 'Zomer', height: '100-200 cm', sun: 'Volle zon', water: 'Laag', hardiness: 'Matig', nativeRange: ['Europa'] },
  { latinName: 'Epilobium hirsutum', dutchName: 'Harig wilgenroosje', category: 'herb', family: 'Onagraceae', bloom: 'Zomer', height: '80-200 cm', sun: 'Zon-halfschaduw', water: 'Hoog', hardiness: 'Goed', nativeRange: ['Europa'] },
  { latinName: 'Scabiosa columbaria', dutchName: 'Duifkruid', category: 'flower', family: 'Caprifoliaceae', bloom: 'Zomer', height: '30-80 cm', sun: 'Volle zon', water: 'Laag', hardiness: 'Goed', nativeRange: ['Europa'] },
  { latinName: 'Anthriscus sylvestris', dutchName: 'Fluitenkruid', category: 'herb', family: 'Apiaceae', bloom: 'Lente', height: '60-150 cm', sun: 'Zon-halfschaduw', water: 'Gemiddeld', hardiness: 'Goed', nativeRange: ['Europa'] },
];

function taxonomyFromPlant(plant) {
  return {
    kingdom: 'Plantae',
    phylum: 'Tracheophyta',
    class: plant.category === 'fern' ? 'Polypodiopsida' : 'Magnoliopsida',
    order: '',
    family: plant.family,
    genus: plant.latinName.split(' ')[0],
    species: plant.latinName,
  };
}

function makeDescription(plant) {
  return {
    nl: `${plant.dutchName} (${plant.latinName}) is een ${plant.category === 'tree' ? 'boom' : plant.category === 'shrub' ? 'struik' : plant.category === 'fern' ? 'varen' : plant.category === 'grass' ? 'grasachtige' : 'kruidachtige'} plant uit de familie ${plant.family}. Deze soort bloeit meestal in ${plant.bloom.toLowerCase()} en komt van nature voor in ${plant.nativeRange.join(', ')}.`,
    en: `${plant.latinName} is a ${plant.category} species in the ${plant.family} family. It typically blooms in ${plant.bloom.toLowerCase()} and is native to ${plant.nativeRange.join(', ')}.`,
  };
}

function makeDeep(plant) {
  return {
    history: {
      nl: `${plant.dutchName} wordt al lang waargenomen in Europese landschappen en is relevant in veldbotanische determinaties.`,
      en: `${plant.latinName} has long been documented in European habitats and is commonly referenced in field botany guides.`,
    },
    etymology: {
      nl: `De geslachtsnaam ${plant.latinName.split(' ')[0]} verwijst naar klassieke botanische naamgeving; de soortnaam sluit aan bij historische taxonomie.`,
      en: `The genus ${plant.latinName.split(' ')[0]} follows classical botanical naming conventions, while the species epithet reflects historical taxonomy.`,
    },
    culturalSignificance: {
      nl: `${plant.dutchName} heeft ecologische en educatieve waarde in natuuronderwijs en biodiversiteitsprojecten.`,
      en: `${plant.latinName} has ecological and educational value in biodiversity and nature-learning contexts.`,
    },
    usesTraditional: ['Natuuronderwijs', 'Veldgids-determinatie'],
    usesModern: ['Biodiversiteitsmonitoring', 'Ecologisch tuinontwerp'],
    conservationStatus: 'Least Concern',
  };
}

function buildCoreData() {
  return PLANTS.map((entry, index) => ({
    id: entry.latinName.toLowerCase().replace(/\s+/g, '-'),
    latinName: entry.latinName,
    names: {
      nl: entry.dutchName,
      en: '',
      de: '',
      fr: '',
      es: '',
    },
    taxonomy: taxonomyFromPlant(entry),
    traits: {
      sun: entry.sun,
      water: entry.water,
      hardiness: entry.hardiness,
      height: entry.height,
      growthHabit: entry.category,
      bloomTime: entry.bloom,
      nativeRange: entry.nativeRange.join(', '),
    },
    thumbnail: `assets/images/thumbs/${entry.latinName.toLowerCase().replace(/\s+/g, '-')}.jpg`,
    category: entry.category,
    popularityScore: Math.max(50, 100 - Math.floor(index / 2)),
  }));
}

function buildDetailData(coreData) {
  return coreData.map((plant) => {
    const source = PLANTS.find((p) => p.latinName === plant.latinName);
    return {
      id: plant.id,
      general: {
        description: makeDescription(source),
        family: source.family,
        nativeRange: source.nativeRange,
        growthHabit: source.category,
        bloomTime: source.bloom,
        height: source.height,
      },
      deep: makeDeep(source),
      images: [],
      sources: [
        { name: 'Wikipedia', url: `https://en.wikipedia.org/wiki/${encodeURIComponent(plant.latinName)}` },
        { name: 'GBIF', url: `https://www.gbif.org/species/search?q=${encodeURIComponent(plant.latinName)}` },
      ],
    };
  });
}

function buildSearchIndex(coreData) {
  return coreData.map((plant) => ({
    id: plant.id,
    terms: [
      plant.latinName.toLowerCase(),
      ...Object.values(plant.names).filter(Boolean).map((n) => n.toLowerCase()),
      plant.taxonomy.family.toLowerCase(),
      plant.taxonomy.genus.toLowerCase(),
      plant.category.toLowerCase(),
      String(plant.traits.nativeRange || '').toLowerCase(),
    ].filter(Boolean),
    preview: {
      latin: plant.latinName,
      thumbnail: plant.thumbnail,
    },
  }));
}

async function main() {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  fs.mkdirSync(IMAGES_DIR, { recursive: true });

  const coreData = buildCoreData().slice(0, 100);
  const detailData = buildDetailData(coreData);
  const searchIndex = buildSearchIndex(coreData);

  fs.writeFileSync(path.join(OUTPUT_DIR, 'plants-core.json'), JSON.stringify(coreData, null, 2));
  fs.writeFileSync(path.join(OUTPUT_DIR, 'plants-detail.json'), JSON.stringify(detailData, null, 2));
  fs.writeFileSync(path.join(OUTPUT_DIR, 'search-index.json'), JSON.stringify(searchIndex, null, 2));

  console.log(`Generated ${coreData.length} plants with richer detail data.`);
}

main().catch(console.error);
