import axios from "axios";
import { translateChampion, translatePosition } from "../utils/lolMaps";

const API_KEY = process.env.REACT_APP_RIOT_API_KEY;
const BASE_URL = "https://asia.api.riotgames.com";
const REGION_URL = "https://kr.api.riotgames.com";

// ✅ 공통 요청 함수 (429 에러 시 2분 대기 후 재시도)
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function safeRequest(url) {
  try {
    // 이미 URL에 ?가 있으면 &로 연결, 없으면 ?로 연결
    const separator = url.includes("?") ? "&" : "?";
    const res = await axios.get(`${url}${separator}api_key=${API_KEY}`);
    return res.data;
  } catch (error) {
    if (error.response?.status === 429) {
      console.warn("⚠️ Riot API 요청 한도 초과 → 2분 대기 후 재시도합니다...");
      await delay(120000);
      return await safeRequest(url);
    } else {
      console.error("❌ 요청 실패:", error.response?.data || error.message);
      throw error;
    }
  }
}

// 🔹 PUUID 조회
export async function getPuuidByRiotId(summonerName, tagLine) {
  const encodedName = encodeURIComponent(summonerName);
  const encodedTag = encodeURIComponent(tagLine);
  const url = `${BASE_URL}/riot/account/v1/accounts/by-riot-id/${encodedName}/${encodedTag}`;
  return await safeRequest(url);
}

// 🔹 티어 조회
export async function getRankByPuuid(puuid) {
  const url = `${REGION_URL}/lol/league/v4/entries/by-puuid/${puuid}`;
  const data = await safeRequest(url);

  const solo = data.find((entry) => entry.queueType === "RANKED_SOLO_5x5");
  return { tier: solo ? `${solo.tier} ${solo.rank}` : "UNRANKED" };
}

// 🔹 최근 매치 20게임
export async function getRecentMatchIds(puuid) {
  const url = `${BASE_URL}/lol/match/v5/matches/by-puuid/${puuid}/ids?count=20`;
  return await safeRequest(url);
}

// 🔹 매치 상세
export async function getMatchDetail(matchId) {
  const url = `${BASE_URL}/lol/match/v5/matches/${matchId}`;
  return await safeRequest(url);
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
