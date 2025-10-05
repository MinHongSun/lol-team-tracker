import { db } from "../firebaseConfig";
import { doc, setDoc } from "firebase/firestore";
import {
  getPuuidByRiotId,
  getRankByPuuid,
  analyzeRecentMatches,
} from "../api/riotApi";

export async function refreshTeamData(usersSnapshot) {
  const playerData = [];

  for (const userDoc of usersSnapshot.docs) {
    const user = userDoc.data();
    const { summonerName, tagLine } = user;
    if (!summonerName || !tagLine) continue;

    try {
      const account = await getPuuidByRiotId(summonerName, tagLine);
      const rankInfo = await getRankByPuuid(account.puuid);
      const { mainLane, top3Champs } = await analyzeRecentMatches(account.puuid);

      const playerInfo = {
        summonerName,
        tier: rankInfo.tier,
        mainLane,
        topChampions: top3Champs,
        updatedAt: new Date().toISOString(),
      };

      // ✅ Firestore에 teamData 저장
      await setDoc(doc(db, "teamData", summonerName), playerInfo);

      playerData.push(playerInfo);
    } catch (err) {
      console.error(`❌ ${summonerName} 갱신 실패:`, err.message);
    }
  }

  return playerData;
}
