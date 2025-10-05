import axios from "axios";
import { translateChampion, translatePosition } from "../utils/lolMaps";

const API_KEY = process.env.REACT_APP_RIOT_API_KEY;
const BASE_URL = "https://asia.api.riotgames.com";
const REGION_URL = "https://kr.api.riotgames.com";

// 🔹 PUUID 조회
export async function getPuuidByRiotId(summonerName, tagLine) {
  const encodedName = encodeURIComponent(summonerName);
  const encodedTag = encodeURIComponent(tagLine);
  const res = await axios.get(
    `${BASE_URL}/riot/account/v1/accounts/by-riot-id/${encodedName}/${encodedTag}?api_key=${API_KEY}`
  );
  return res.data;
}

// 🔹 티어 조회
export async function getRankByPuuid(puuid) {
  const res = await axios.get(
    `${REGION_URL}/lol/league/v4/entries/by-puuid/${puuid}?api_key=${API_KEY}`
  );
  const data = res.data;
  const solo = data.find((entry) => entry.queueType === "RANKED_SOLO_5x5");
  return { tier: solo ? `${solo.tier} ${solo.rank}` : "UNRANKED" };
}

// 🔹 최근 매치 20게임
export async function getRecentMatchIds(puuid) {
  const res = await axios.get(
    `${BASE_URL}/lol/match/v5/matches/by-puuid/${puuid}/ids?count=20&api_key=${API_KEY}`
  );
  return res.data;
}

// 🔹 매치 상세
export async function getMatchDetail(matchId) {
  const res = await axios.get(
    `${BASE_URL}/lol/match/v5/matches/${matchId}?api_key=${API_KEY}`
  );
  return res.data;
}

// 🔹 최근 매치 분석
export async function analyzeRecentMatches(puuid) {
  const matchIds = await getRecentMatchIds(puuid);
  const laneCount = {};
  const champCount = {};

  for (const matchId of matchIds) {
    const match = await getMatchDetail(matchId);
    const participant = match.info.participants.find((p) => p.puuid === puuid);
    if (!participant) continue;

    const lane = translatePosition(participant.teamPosition || "UNKNOWN");
    const champ = translateChampion(participant.championName);

    laneCount[lane] = (laneCount[lane] || 0) + 1;
    champCount[champ] = (champCount[champ] || 0) + 1;
  }

  const mainLane = Object.keys(laneCount).sort((a, b) => laneCount[b] - laneCount[a])[0] || "미정";
  const top3Champs = Object.keys(champCount)
    .sort((a, b) => champCount[b] - champCount[a])
    .slice(0, 3);

  return { mainLane, top3Champs };
}
