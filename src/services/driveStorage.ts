import { getAccessToken } from './driveAuth';
import { Creature, Region } from '../types';

export interface GameSaveData {
  version: string;
  savedAt: string;
  playerCreature: Creature;
  unlockedRegionIndex: number;
  clearedLevels: Record<string, boolean>;
  userCoins: number;
  playTimeMinutes?: number;
  notes?: string;
}

export interface DriveFileInfo {
  id: string;
  name: string;
  modifiedTime: string;
  size?: string;
  description?: string;
}

const DRIVE_FILES_API = 'https://www.googleapis.com/drive/v3/files';
const DRIVE_UPLOAD_API = 'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart';

/**
 * Searches or creates the game save folder in Google Drive
 */
export async function getOrCreateSaveFolder(token: string): Promise<string> {
  const folderName = 'Batalha das Funções - Saves';
  const query = `mimeType='application/vnd.google-apps.folder' and name='${folderName}' and trashed=false`;
  
  const searchRes = await fetch(`${DRIVE_FILES_API}?q=${encodeURIComponent(query)}&fields=files(id,name)`, {
    headers: { Authorization: `Bearer ${token}` }
  });

  if (!searchRes.ok) {
    throw new Error('Falha ao buscar pasta no Google Drive');
  }

  const searchData = await searchRes.json();
  if (searchData.files && searchData.files.length > 0) {
    return searchData.files[0].id;
  }

  // Create folder
  const createRes = await fetch(DRIVE_FILES_API, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name: folderName,
      mimeType: 'application/vnd.google-apps.folder',
      description: 'Pasta de salvamentos automáticos e manuais do RPG Batalha das Funções'
    })
  });

  if (!createRes.ok) {
    throw new Error('Falha ao criar pasta de salvamento no Google Drive');
  }

  const createData = await createRes.json();
  return createData.id;
}

/**
 * Lists all game saves stored in Google Drive
 */
export async function listDriveSaveFiles(): Promise<DriveFileInfo[]> {
  const token = await getAccessToken();
  if (!token) throw new Error('Usuário não autenticado no Google Drive');

  // Search inside folder or with prefix
  const query = `name contains 'BatalhaFuncoes_' and trashed=false`;
  const res = await fetch(
    `${DRIVE_FILES_API}?q=${encodeURIComponent(query)}&orderBy=modifiedTime desc&fields=files(id,name,modifiedTime,size,description)`,
    {
      headers: { Authorization: `Bearer ${token}` }
    }
  );

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || 'Erro ao listar arquivos do Google Drive');
  }

  const data = await res.json();
  return data.files || [];
}

/**
 * Saves current game progress into Google Drive as JSON
 */
export async function saveGameToDrive(
  saveData: GameSaveData,
  customFileName?: string
): Promise<DriveFileInfo> {
  const token = await getAccessToken();
  if (!token) throw new Error('Usuário não autenticado no Google Drive');

  const folderId = await getOrCreateSaveFolder(token).catch(() => undefined);

  const dateStr = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const creatureName = saveData.playerCreature.name || 'Heroi';
  const fileName = customFileName || `BatalhaFuncoes_Save_${creatureName}_Lv${saveData.playerCreature.level}_${dateStr}.json`;

  const metadata: Record<string, any> = {
    name: fileName,
    mimeType: 'application/json',
    description: `Save do jogo Batalha das Funções: ${creatureName} (Nvl ${saveData.playerCreature.level}) - Salvo em ${new Date().toLocaleString()}`,
  };

  if (folderId) {
    metadata.parents = [folderId];
  }

  const jsonContent = JSON.stringify(saveData, null, 2);
  const boundary = '-------314159265358979323846';
  const delimiter = `\r\n--${boundary}\r\n`;
  const closeDelimiter = `\r\n--${boundary}--`;

  const multipartRequestBody =
    delimiter +
    'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
    JSON.stringify(metadata) +
    delimiter +
    'Content-Type: application/json\r\n\r\n' +
    jsonContent +
    closeDelimiter;

  const res = await fetch(DRIVE_UPLOAD_API, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': `multipart/related; boundary=${boundary}`
    },
    body: multipartRequestBody
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || 'Falha ao salvar arquivo no Google Drive');
  }

  const result = await res.json();
  return result;
}

/**
 * Loads a game save file content from Google Drive
 */
export async function loadGameFromDrive(fileId: string): Promise<GameSaveData> {
  const token = await getAccessToken();
  if (!token) throw new Error('Usuário não autenticado no Google Drive');

  const res = await fetch(`${DRIVE_FILES_API}/${fileId}?alt=media`, {
    headers: { Authorization: `Bearer ${token}` }
  });

  if (!res.ok) {
    throw new Error('Falha ao baixar arquivo de save do Google Drive');
  }

  const data: GameSaveData = await res.json();
  if (!data.playerCreature || !data.playerCreature.name) {
    throw new Error('Arquivo de save inválido ou incompatível.');
  }

  return data;
}

/**
 * Deletes a save file from Google Drive
 */
export async function deleteSaveFromDrive(fileId: string): Promise<void> {
  const token = await getAccessToken();
  if (!token) throw new Error('Usuário não autenticado no Google Drive');

  const res = await fetch(`${DRIVE_FILES_API}/${fileId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` }
  });

  if (!res.ok && res.status !== 204) {
    throw new Error('Falha ao excluir arquivo do Google Drive');
  }
}
