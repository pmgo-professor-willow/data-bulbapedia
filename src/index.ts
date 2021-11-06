// Node modules.
import { mkdirp, writeFile } from 'fs-extra';
// Local modules.
import { getCommunityDays } from './communityDays';

const main = async () => {
  const outputPath = './artifacts';
  await mkdirp(outputPath);

  // community days.
  try {
    const communityDays = await getCommunityDays();
    await writeFile(`${outputPath}/communityDays.json`, JSON.stringify(communityDays, null, 2));
    await writeFile(`${outputPath}/communityDays.min.json`, JSON.stringify(communityDays));
  } catch (e) {
    console.error(e);
  }
};

main();
