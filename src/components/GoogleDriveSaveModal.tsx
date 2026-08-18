import React, { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import {
  initAuth,
  googleSignIn,
  logoutGoogle,
  getAccessToken
} from '../services/driveAuth';
import {
  listDriveSaveFiles,
  saveGameToDrive,
  loadGameFromDrive,
  deleteSaveFromDrive,
  DriveFileInfo,
  GameSaveData
} from '../services/driveStorage';
import { Creature } from '../types';
import { sound } from '../utils/audio';
import {
  Cloud,
  CloudUpload,
  CloudDownload,
  Trash2,
  RefreshCw,
  X,
  CheckCircle2,
  AlertCircle,
  HardDrive,
  LogOut,
  Sparkles,
  AlertTriangle,
  Clock,
  ShieldCheck
} from 'lucide-react';

interface GoogleDriveSaveModalProps {
  playerCreature: Creature | null;
  unlockedRegionIndex: number;
  clearedLevels: Record<string, boolean>;
  userCoins: number;
  onRestoreSave: (saveData: GameSaveData) => void;
  onClose: () => void;
}

export const GoogleDriveSaveModal: React.FC<GoogleDriveSaveModalProps> = ({
  playerCreature,
  unlockedRegionIndex,
  clearedLevels,
  userCoins,
  onRestoreSave,
  onClose
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [driveFiles, setDriveFiles] = useState<DriveFileInfo[]>([]);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
  
  // Confirmation states
  const [fileToDelete, setFileToDelete] = useState<DriveFileInfo | null>(null);
  const [fileToLoad, setFileToLoad] = useState<DriveFileInfo | null>(null);

  // Check auth state
  useEffect(() => {
    const unsubscribe = initAuth(
      (currentUser, currentToken) => {
        setUser(currentUser);
        setToken(currentToken);
        loadFiles();
      },
      () => {
        setUser(null);
        setToken(null);
        setDriveFiles([]);
      }
    );

    // Initial check
    getAccessToken().then(tk => {
      if (tk) {
        setToken(tk);
        loadFiles();
      }
    });

    return () => unsubscribe();
  }, []);

  const loadFiles = async () => {
    setLoading(true);
    try {
      const files = await listDriveSaveFiles();
      setDriveFiles(files);
    } catch (err: any) {
      console.error('Erro ao listar arquivos do Drive:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    setLoading(true);
    setStatusMessage(null);
    try {
      const result = await googleSignIn();
      if (result) {
        setUser(result.user);
        setToken(result.accessToken);
        sound.playVictory();
        setStatusMessage({ type: 'success', text: `Conectado como ${result.user.displayName || result.user.email}!` });
        await loadFiles();
      }
    } catch (err: any) {
      console.error(err);
      sound.playWrong();
      setStatusMessage({ type: 'error', text: err.message || 'Falha ao conectar com o Google Drive.' });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    sound.playSelect();
    await logoutGoogle();
    setUser(null);
    setToken(null);
    setDriveFiles([]);
    setStatusMessage({ type: 'info', text: 'Desconectado do Google Drive.' });
  };

  const handleSaveToDrive = async () => {
    if (!playerCreature) {
      setStatusMessage({ type: 'error', text: 'Você precisa escolher uma criatura antes de salvar o progresso.' });
      return;
    }

    setLoading(true);
    setStatusMessage(null);
    sound.playSelect();

    try {
      const saveData: GameSaveData = {
        version: '1.0.0',
        savedAt: new Date().toISOString(),
        playerCreature,
        unlockedRegionIndex,
        clearedLevels,
        userCoins,
        notes: `Progresso com ${playerCreature.name} Nível ${playerCreature.level}`
      };

      await saveGameToDrive(saveData);
      sound.playVictory();
      setStatusMessage({
        type: 'success',
        text: `Progresso de ${playerCreature.name} salvo com sucesso no Google Drive!`
      });
      await loadFiles();
    } catch (err: any) {
      console.error(err);
      sound.playWrong();
      setStatusMessage({ type: 'error', text: err.message || 'Erro ao salvar no Google Drive.' });
    } finally {
      setLoading(false);
    }
  };

  const confirmLoadFile = async () => {
    if (!fileToLoad) return;
    setLoading(true);
    sound.playSelect();

    try {
      const loaded = await loadGameFromDrive(fileToLoad.id);
      onRestoreSave(loaded);
      sound.playVictory();
      setStatusMessage({
        type: 'success',
        text: `Jogo restaurado com sucesso! Bem-vindo de volta, ${loaded.playerCreature.name}.`
      });
      setFileToLoad(null);
    } catch (err: any) {
      sound.playWrong();
      setStatusMessage({ type: 'error', text: err.message || 'Erro ao carregar o save do Google Drive.' });
    } finally {
      setLoading(false);
    }
  };

  const confirmDeleteFile = async () => {
    if (!fileToDelete) return;
    setLoading(true);
    sound.playSelect();

    try {
      await deleteSaveFromDrive(fileToDelete.id);
      setStatusMessage({ type: 'info', text: 'Arquivo de save excluído do Google Drive.' });
      setFileToDelete(null);
      await loadFiles();
    } catch (err: any) {
      sound.playWrong();
      setStatusMessage({ type: 'error', text: err.message || 'Erro ao excluir arquivo.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-white border-3 sm:border-4 border-black rounded-lg sm:rounded-xl max-w-2xl w-full p-3 sm:p-5 shadow-[4px_4px_0px_#000000] sm:shadow-[6px_6px_0px_#000000] text-black relative max-h-[94vh] sm:max-h-[90vh] flex flex-col space-y-2.5 sm:space-y-3.5">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-black pb-2 sm:pb-2.5">
          <div className="flex items-center gap-2 sm:gap-2.5">
            <div className="p-1.5 sm:p-2 bg-white border-2 border-black text-black">
              <Cloud size={20} />
            </div>
            <div>
              <h2 className="font-pixel text-xs sm:text-base text-black font-black uppercase">Nuvem Drive</h2>
              <p className="font-mono text-[10px] sm:text-xs text-slate-700 font-bold">Sincronize seu save na nuvem</p>
            </div>
          </div>
          <button
            onClick={() => {
              sound.playSelect();
              onClose();
            }}
            className="p-1 sm:p-1.5 bg-white hover:bg-black hover:text-white border-2 border-black text-black transition-colors cursor-pointer font-bold"
          >
            <X size={16} />
          </button>
        </div>

        {/* Status Alerts */}
        {statusMessage && (
          <div
            className={`p-2 sm:p-2.5 border-2 text-[11px] sm:text-xs font-mono font-bold flex items-center gap-2 ${
              statusMessage.type === 'success'
                ? 'bg-slate-100 border-black text-black'
                : statusMessage.type === 'error'
                ? 'bg-black border-black text-white'
                : 'bg-white border-black text-black'
            }`}
          >
            {statusMessage.type === 'success' && <CheckCircle2 size={14} className="shrink-0" />}
            {statusMessage.type === 'error' && <AlertCircle size={14} className="shrink-0" />}
            {statusMessage.type === 'info' && <ShieldCheck size={14} className="shrink-0" />}
            <span className="flex-1 line-clamp-2">{statusMessage.text}</span>
          </div>
        )}

        {/* Auth Box */}
        <div className="bg-slate-50 border-2 border-black p-2.5 sm:p-3.5 flex flex-col sm:flex-row items-center justify-between gap-2.5 sm:gap-3 shadow-[2px_2px_0_#000]">
          {user ? (
            <>
              <div className="flex items-center gap-2 sm:gap-2.5 min-w-0 w-full sm:w-auto">
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || 'Google User'}
                    className="w-8 h-8 sm:w-9 sm:h-9 border-2 border-black gb-sprite-mono shrink-0"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-8 h-8 sm:w-9 sm:h-9 bg-black text-white border-2 border-black flex items-center justify-center font-pixel text-xs shrink-0">
                    {user.displayName?.charAt(0) || 'G'}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <div className="font-pixel text-[10px] sm:text-[11px] text-black font-black uppercase truncate">{user.displayName || 'Jogador'}</div>
                  <div className="font-mono text-[10px] sm:text-xs text-slate-700 font-bold truncate">{user.email}</div>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <button
                  onClick={handleLogout}
                  className="px-2.5 sm:px-3 py-1 bg-white hover:bg-black hover:text-white text-[11px] sm:text-xs font-mono text-black font-bold flex items-center gap-1.5 transition-colors border-2 border-black cursor-pointer shadow-[1px_1px_0_#000]"
                >
                  <LogOut size={12} /> Sair
                </button>
              </div>
            </>
          ) : (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5 w-full">
              <div className="space-y-0.5 text-center sm:text-left">
                <div className="font-pixel text-[10px] sm:text-[11px] text-black font-black uppercase">Google Drive Desconectado</div>
                <div className="font-mono text-[11px] sm:text-xs text-slate-700 font-bold">
                  Conecte para salvar e restaurar dados na nuvem.
                </div>
              </div>

              {/* Google Sign-in button */}
              <button
                onClick={handleLogin}
                disabled={loading}
                className="w-full sm:w-auto bg-white hover:bg-black hover:text-white text-black font-pixel text-[10px] sm:text-xs px-3 py-2 flex items-center justify-center gap-2 transition-all shadow-[2px_2px_0_#000] border-2 border-black disabled:opacity-50 cursor-pointer font-black"
              >
                <span>ENTRAR COM GOOGLE</span>
              </button>
            </div>
          )}
        </div>

        {/* Cloud Actions and Save List */}
        <div className="flex-1 overflow-y-auto space-y-2.5 sm:space-y-3 pr-1 custom-scrollbar min-h-[160px]">
          {user ? (
            <>
              {/* Quick Save Card */}
              <div className="bg-slate-50 border-2 border-black p-2.5 sm:p-3.5 flex flex-col sm:flex-row items-center justify-between gap-2.5 shadow-[2px_2px_0_#000]">
                <div className="space-y-0.5 text-center sm:text-left">
                  <div className="font-pixel text-[10px] sm:text-[11px] text-black font-black flex items-center justify-center sm:justify-start gap-1.5 uppercase">
                    <Sparkles size={12} /> Salvar Progresso Atual
                  </div>
                  <div className="font-mono text-[11px] sm:text-xs text-slate-700 font-bold">
                    {playerCreature ? (
                      <span>
                        {playerCreature.name} (Nv {playerCreature.level}) • {userCoins}🪙
                      </span>
                    ) : (
                      <span className="text-slate-500">Nenhum monstro selecionado</span>
                    )}
                  </div>
                </div>

                <button
                  onClick={handleSaveToDrive}
                  disabled={loading || !playerCreature}
                  className="w-full sm:w-auto gb-btn-primary px-3 py-2 text-[10px] sm:text-[11px] flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shadow-[2px_2px_0_#000]"
                >
                  <CloudUpload size={13} /> SALVAR NO DRIVE
                </button>
              </div>

              {/* Drive File List */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[11px] sm:text-xs font-mono text-black font-bold px-1">
                  <span className="flex items-center gap-1.5">
                    <HardDrive size={12} /> Saves na Nuvem ({driveFiles.length})
                  </span>
                  <button
                    onClick={loadFiles}
                    disabled={loading}
                    className="hover:text-slate-600 flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <RefreshCw size={11} className={loading ? 'animate-spin' : ''} /> Atualizar
                  </button>
                </div>

                {driveFiles.length === 0 ? (
                  <div className="bg-slate-50 border-2 border-dashed border-black p-4 sm:p-6 text-center font-mono text-xs text-slate-600 space-y-1 font-bold">
                    <Cloud size={24} className="mx-auto opacity-60" />
                    <div>Nenhum save encontrado no seu Google Drive.</div>
                    <div className="text-[10px]">Clique em "Salvar no Drive" para criar um backup.</div>
                  </div>
                ) : (
                  <div className="space-y-1.5 sm:space-y-2">
                    {driveFiles.map((file) => (
                      <div
                        key={file.id}
                        className="bg-white border-2 border-black p-2.5 sm:p-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 shadow-[2px_2px_0_#000]"
                      >
                        <div className="space-y-0.5 min-w-0">
                          <div className="font-pixel text-[10px] sm:text-[11px] text-black font-black uppercase truncate">
                            {file.name}
                          </div>
                          <div className="flex flex-wrap items-center gap-1.5 font-mono text-[10px] sm:text-xs text-slate-600 font-bold">
                            <span className="flex items-center gap-1">
                              <Clock size={10} /> {new Date(file.modifiedTime).toLocaleDateString()}
                            </span>
                            {file.description && <span className="truncate">| {file.description}</span>}
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 w-full sm:w-auto justify-end">
                          <button
                            onClick={() => setFileToLoad(file)}
                            className="flex-1 sm:flex-none px-2.5 py-1 bg-white hover:bg-black hover:text-white border-2 border-black text-black font-pixel text-[9px] sm:text-[10px] flex items-center justify-center gap-1 transition-colors cursor-pointer font-bold"
                          >
                            <CloudDownload size={11} /> CARREGAR
                          </button>
                          <button
                            onClick={() => setFileToDelete(file)}
                            className="p-1 bg-white hover:bg-black hover:text-white border-2 border-black text-black transition-colors cursor-pointer shrink-0"
                            title="Excluir save do Google Drive"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="bg-slate-50 border-2 border-black p-4 sm:p-6 text-center space-y-2.5 shadow-[2px_2px_0_#000]">
              <Cloud size={30} className="mx-auto" />
              <div className="space-y-1">
                <h3 className="font-pixel text-[11px] sm:text-xs text-black font-black uppercase">Conecte sua conta do Google</h3>
                <p className="font-mono text-[11px] sm:text-xs text-slate-700 max-w-sm mx-auto font-bold">
                  Guarde seus monstros, níveis, fases desbloqueadas e moedas com segurança na nuvem.
                </p>
              </div>
              <button
                onClick={handleLogin}
                className="gb-btn-primary inline-flex items-center gap-1.5 px-3.5 py-2 font-pixel text-[10px] sm:text-[11px] cursor-pointer shadow-[2px_2px_0_#000]"
              >
                CONECTAR COM GOOGLE ▶
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t-2 border-black pt-2 flex items-center justify-between text-[11px] sm:text-xs font-mono text-slate-700 font-bold">
          <span className="truncate">Pasta: <strong>/Batalha das Funções</strong></span>
          <button
            onClick={onClose}
            className="px-2.5 py-1 bg-white hover:bg-black hover:text-white border-2 border-black text-black text-xs font-mono font-bold cursor-pointer shrink-0 ml-2"
          >
            Fechar
          </button>
        </div>

        {/* Modal Confirmação Carregar */}
        {fileToLoad && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-sm">
            <div className="bg-white border-3 sm:border-4 border-black max-w-md w-full p-3.5 sm:p-4 space-y-2.5 sm:space-y-3 text-center shadow-[4px_4px_0_#000] sm:shadow-[6px_6px_0_#000] text-black">
              <div className="p-2 bg-black text-white w-9 h-9 mx-auto flex items-center justify-center border-2 border-black">
                <CloudDownload size={18} />
              </div>
              <div className="space-y-1">
                <h3 className="font-pixel text-[11px] sm:text-xs text-black font-black uppercase">Carregar Progresso?</h3>
                <p className="font-mono text-xs text-slate-800 font-bold">
                  Carregar o save <strong>"{fileToLoad.name}"</strong> substituirá os dados da sessão atual.
                </p>
              </div>
              <div className="flex items-center justify-center gap-2 pt-1">
                <button
                  onClick={() => setFileToLoad(null)}
                  className="px-3 py-1.5 bg-white hover:bg-black hover:text-white border-2 border-black text-black font-mono text-xs font-bold cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmLoadFile}
                  disabled={loading}
                  className="gb-btn-primary px-3 py-1.5 text-[10px] sm:text-[11px] flex items-center gap-1.5 cursor-pointer font-black"
                >
                  Confirmar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal Confirmação Excluir */}
        {fileToDelete && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-sm">
            <div className="bg-white border-3 sm:border-4 border-black max-w-md w-full p-3.5 sm:p-4 space-y-2.5 sm:space-y-3 text-center shadow-[4px_4px_0_#000] sm:shadow-[6px_6px_0_#000] text-black">
              <div className="p-2 bg-black text-white w-9 h-9 mx-auto flex items-center justify-center border-2 border-black">
                <AlertTriangle size={18} />
              </div>
              <div className="space-y-1">
                <h3 className="font-pixel text-[11px] sm:text-xs text-black font-black uppercase">Excluir Save?</h3>
                <p className="font-mono text-xs text-slate-800 font-bold">
                  Excluir permanentemente <strong>"{fileToDelete.name}"</strong> da nuvem?
                </p>
              </div>
              <div className="flex items-center justify-center gap-2 pt-1">
                <button
                  onClick={() => setFileToDelete(null)}
                  className="px-3 py-1.5 bg-white hover:bg-black hover:text-white border-2 border-black text-black font-mono text-xs font-bold cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmDeleteFile}
                  disabled={loading}
                  className="gb-btn-primary px-3 py-1.5 text-[10px] sm:text-[11px] flex items-center gap-1.5 cursor-pointer font-black"
                >
                  Excluir
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
