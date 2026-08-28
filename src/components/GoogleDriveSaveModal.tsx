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
    sound.playSelect();
    setLoading(true);
    setStatusMessage(null);

    try {
      const res = await googleSignIn();
      setUser(res.user);
      setToken(res.accessToken);
      setStatusMessage({ type: 'success', text: `Conectado com sucesso como ${res.user.displayName || res.user.email}!` });
      await loadFiles();
    } catch (err: any) {
      console.error(err);
      sound.playWrong();
      setStatusMessage({ type: 'error', text: err.message || 'Falha ao autenticar com o Google.' });
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-xs">
      <div className="bg-[#fbfdfa] border-3 sm:border-4 border-[#1b3b2b] rounded-2xl max-w-2xl w-full p-3.5 sm:p-5 shadow-[6px_6px_0px_#122b1e] text-[#163323] relative max-h-[94vh] sm:max-h-[90vh] flex flex-col space-y-3">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-[#2d5a42]/30 pb-2.5">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-sky-100 border-2 border-sky-600 rounded-xl text-sky-800 shadow-xs">
              <Cloud size={20} />
            </div>
            <div>
              <h2 className="font-pixel text-xs sm:text-base text-[#143021] font-black uppercase">Nuvem Google Drive</h2>
              <p className="font-mono text-[10px] sm:text-xs text-emerald-800 font-bold">Sincronize seu progresso na nuvem</p>
            </div>
          </div>
          <button
            onClick={() => {
              sound.playSelect();
              onClose();
            }}
            className="p-1.5 bg-white hover:bg-rose-50 text-rose-800 border-2 border-[#1b3b2b] rounded-lg transition-colors cursor-pointer font-bold shadow-xs"
          >
            <X size={16} />
          </button>
        </div>

        {/* Status Alerts */}
        {statusMessage && (
          <div
            className={`p-2.5 border-2 rounded-xl text-[11px] sm:text-xs font-mono font-bold flex items-center gap-2 shadow-xs ${
              statusMessage.type === 'success'
                ? 'bg-emerald-100 border-emerald-700 text-emerald-950'
                : statusMessage.type === 'error'
                ? 'bg-rose-100 border-rose-700 text-rose-950'
                : 'bg-sky-100 border-sky-700 text-sky-950'
            }`}
          >
            {statusMessage.type === 'success' && <CheckCircle2 size={15} className="shrink-0 text-emerald-700" />}
            {statusMessage.type === 'error' && <AlertCircle size={15} className="shrink-0 text-rose-700" />}
            {statusMessage.type === 'info' && <ShieldCheck size={15} className="shrink-0 text-sky-700" />}
            <span className="flex-1 line-clamp-2">{statusMessage.text}</span>
          </div>
        )}

        {/* Auth Box */}
        <div className="bg-[#f0f7f2] border-2 border-[#1b3b2b] rounded-xl p-3 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-inner">
          {user ? (
            <>
              <div className="flex items-center gap-2.5 min-w-0 w-full sm:w-auto">
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || 'Google User'}
                    className="w-9 h-9 border-2 border-[#1b3b2b] rounded-full gba-sprite shrink-0"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-9 h-9 bg-emerald-700 text-white border-2 border-[#1b3b2b] rounded-full flex items-center justify-center font-pixel text-xs shrink-0">
                    {user.displayName?.charAt(0) || 'G'}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <div className="font-pixel text-[10px] sm:text-[11px] text-[#143021] font-black uppercase truncate">{user.displayName || 'Jogador'}</div>
                  <div className="font-mono text-[10px] sm:text-xs text-slate-600 font-bold truncate">{user.email}</div>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <button
                  onClick={handleLogout}
                  className="px-3 py-1 bg-white hover:bg-rose-50 text-[11px] sm:text-xs font-mono text-rose-800 font-bold flex items-center gap-1.5 transition-colors border-2 border-rose-300 rounded-lg cursor-pointer shadow-xs"
                >
                  <LogOut size={12} /> Sair
                </button>
              </div>
            </>
          ) : (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5 w-full">
              <div className="space-y-0.5 text-center sm:text-left">
                <div className="font-pixel text-[10px] sm:text-[11px] text-[#143021] font-black uppercase">Google Drive Desconectado</div>
                <div className="font-mono text-[11px] sm:text-xs text-slate-600 font-bold">
                  Conecte para salvar e restaurar seus dados na nuvem.
                </div>
              </div>

              {/* Google Sign-in button */}
              <button
                onClick={handleLogin}
                disabled={loading}
                className="w-full sm:w-auto gba-btn-blue font-pixel text-[10px] sm:text-xs px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer font-black"
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
              <div className="bg-[#edf7f1] border-2 border-[#1b3b2b] rounded-xl p-3 flex flex-col sm:flex-row items-center justify-between gap-2.5 shadow-xs">
                <div className="space-y-0.5 text-center sm:text-left">
                  <div className="font-pixel text-[10px] sm:text-[11px] text-emerald-950 font-black flex items-center justify-center sm:justify-start gap-1.5 uppercase">
                    <Sparkles size={13} className="text-amber-500" /> Salvar Progresso Atual
                  </div>
                  <div className="font-mono text-[11px] sm:text-xs text-emerald-800 font-bold">
                    {playerCreature ? (
                      <span>
                        {playerCreature.name} (Nv {playerCreature.level}) • {userCoins}
                      </span>
                    ) : (
                      <span className="text-slate-500">Nenhum monstro selecionado</span>
                    )}
                  </div>
                </div>

                <button
                  onClick={handleSaveToDrive}
                  disabled={loading || !playerCreature}
                  className="w-full sm:w-auto gba-btn-primary px-4 py-2 text-[10px] sm:text-[11px] rounded-lg flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed font-black"
                >
                  <CloudUpload size={14} /> SALVAR NO DRIVE
                </button>
              </div>

              {/* Drive File List */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[11px] sm:text-xs font-mono text-[#143021] font-bold px-1">
                  <span className="flex items-center gap-1.5">
                    <HardDrive size={13} className="text-emerald-700" /> Saves na Nuvem ({driveFiles.length})
                  </span>
                  <button
                    onClick={loadFiles}
                    disabled={loading}
                    className="hover:text-emerald-700 text-slate-600 flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <RefreshCw size={12} className={loading ? 'animate-spin' : ''} /> Atualizar
                  </button>
                </div>

                {driveFiles.length === 0 ? (
                  <div className="bg-[#f0f7f2] border-2 border-dashed border-[#2d5a42]/40 rounded-xl p-5 text-center font-mono text-xs text-slate-600 space-y-1 font-bold">
                    <Cloud size={26} className="mx-auto opacity-50 text-emerald-700" />
                    <div>Nenhum save encontrado no seu Google Drive.</div>
                    <div className="text-[10px] text-slate-500">Clique em "Salvar no Drive" para criar um backup.</div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {driveFiles.map((file) => (
                      <div
                        key={file.id}
                        className="bg-white border-2 border-[#1b3b2b] rounded-xl p-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 shadow-xs"
                      >
                        <div className="space-y-0.5 min-w-0">
                          <div className="font-pixel text-[10px] sm:text-[11px] text-[#143021] font-black uppercase truncate">
                            {file.name}
                          </div>
                          <div className="flex flex-wrap items-center gap-1.5 font-mono text-[10px] sm:text-xs text-slate-600 font-bold">
                            <span className="flex items-center gap-1">
                              <Clock size={11} className="text-slate-400" /> {new Date(file.modifiedTime).toLocaleDateString()}
                            </span>
                            {file.description && <span className="truncate text-emerald-800">| {file.description}</span>}
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 w-full sm:w-auto justify-end">
                          <button
                            onClick={() => setFileToLoad(file)}
                            className="flex-1 sm:flex-none px-3 py-1.5 gba-btn-blue rounded-lg text-white font-pixel text-[9px] sm:text-[10px] flex items-center justify-center gap-1 transition-all cursor-pointer font-black"
                          >
                            <CloudDownload size={12} /> CARREGAR
                          </button>
                          <button
                            onClick={() => setFileToDelete(file)}
                            className="p-1.5 bg-white hover:bg-rose-50 border-2 border-rose-300 text-rose-700 rounded-lg transition-colors cursor-pointer shrink-0"
                            title="Excluir save do Google Drive"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="bg-[#f0f7f2] border-2 border-[#1b3b2b] rounded-xl p-5 text-center space-y-3 shadow-inner">
              <Cloud size={32} className="mx-auto text-sky-600" />
              <div className="space-y-1">
                <h3 className="font-pixel text-[11px] sm:text-xs text-[#143021] font-black uppercase">Conecte sua conta do Google</h3>
                <p className="font-mono text-[11px] sm:text-xs text-slate-600 max-w-sm mx-auto font-bold">
                  Guarde suas criaturas, níveis, fases desbloqueadas e moedas com segurança na nuvem.
                </p>
              </div>
              <button
                onClick={handleLogin}
                className="gba-btn-blue inline-flex items-center gap-1.5 px-4 py-2 font-pixel text-[10px] sm:text-[11px] rounded-lg cursor-pointer font-black"
              >
                CONECTAR COM GOOGLE 
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t-2 border-[#2d5a42]/30 pt-2 flex items-center justify-between text-[11px] sm:text-xs font-mono text-emerald-800 font-bold">
          <span className="truncate">Pasta: <strong>/Batalha das Funções</strong></span>
          <button
            onClick={onClose}
            className="px-3 py-1 bg-white hover:bg-slate-100 border-2 border-[#1b3b2b] rounded-lg text-[#1b3b2b] text-xs font-mono font-bold cursor-pointer shrink-0 ml-2"
          >
            Fechar
          </button>
        </div>

        {/* Modal Confirmação Carregar */}
        {fileToLoad && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-xs">
            <div className="bg-[#fbfdfa] border-3 sm:border-4 border-[#1b3b2b] rounded-2xl max-w-md w-full p-4 space-y-3 text-center shadow-[6px_6px_0_#122b1e] text-[#163323]">
              <div className="p-2.5 bg-sky-100 text-sky-800 w-11 h-11 mx-auto flex items-center justify-center border-2 border-sky-600 rounded-full">
                <CloudDownload size={20} />
              </div>
              <div className="space-y-1">
                <h3 className="font-pixel text-[11px] sm:text-xs text-[#143021] font-black uppercase">Carregar Progresso?</h3>
                <p className="font-mono text-xs text-slate-700 font-bold">
                  Carregar o save <strong>"{fileToLoad.name}"</strong> substituirá os dados da sessão atual.
                </p>
              </div>
              <div className="flex items-center justify-center gap-2 pt-1">
                <button
                  onClick={() => setFileToLoad(null)}
                  className="px-3 py-1.5 bg-white hover:bg-slate-100 border-2 border-[#1b3b2b] rounded-lg text-[#1b3b2b] font-mono text-xs font-bold cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmLoadFile}
                  disabled={loading}
                  className="gba-btn-primary px-4 py-1.5 text-[10px] sm:text-[11px] rounded-lg flex items-center gap-1.5 cursor-pointer font-black"
                >
                  Confirmar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal Confirmação Excluir */}
        {fileToDelete && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-xs">
            <div className="bg-[#fbfdfa] border-3 sm:border-4 border-[#1b3b2b] rounded-2xl max-w-md w-full p-4 space-y-3 text-center shadow-[6px_6px_0_#122b1e] text-[#163323]">
              <div className="p-2.5 bg-rose-100 text-rose-800 w-11 h-11 mx-auto flex items-center justify-center border-2 border-rose-600 rounded-full">
                <AlertTriangle size={20} />
              </div>
              <div className="space-y-1">
                <h3 className="font-pixel text-[11px] sm:text-xs text-rose-950 font-black uppercase">Excluir Save?</h3>
                <p className="font-mono text-xs text-slate-700 font-bold">
                  Excluir permanentemente <strong>"{fileToDelete.name}"</strong> da nuvem?
                </p>
              </div>
              <div className="flex items-center justify-center gap-2 pt-1">
                <button
                  onClick={() => setFileToDelete(null)}
                  className="px-3 py-1.5 bg-white hover:bg-slate-100 border-2 border-[#1b3b2b] rounded-lg text-[#1b3b2b] font-mono text-xs font-bold cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmDeleteFile}
                  disabled={loading}
                  className="gba-btn-red px-4 py-1.5 text-[10px] sm:text-[11px] rounded-lg flex items-center gap-1.5 cursor-pointer font-black"
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
