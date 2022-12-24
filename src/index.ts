// Node modules.
import { mkdirp, writeFile } from 'fs-extra';
// Local modules.
import { getCommunityDays } from './communityDays';

async function retryToGetCommunityDays(retryCount = 1): Promise<ReturnType<typeof getCommunityDays>> {
  try {
    return await getCommunityDays();
  } catch (error) {
    if (retryCount <= 0) {
      throw error;
    }

    return await retryToGetCommunityDays(retryCount - 1);
  }
}

const main = async () => {
  const outputPath = './artifacts';
  await mkdirp(outputPath);

  // community days.
  try {
    const communityDays = await retryToGetCommunityDays(5);
    await writeFile(`${outputPath}/communityDays.json`, JSON.stringify(communityDays, null, 2));
    await writeFile(`${outputPath}/communityDays.min.json`, JSON.stringify(communityDays));
  } catch (e) {
    console.error(e);
  }
};

main();
