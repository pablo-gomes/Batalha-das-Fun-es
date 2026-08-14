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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-900 border-2 border-cyan-500 rounded-2xl max-w-2xl w-full p-5 sm:p-6 shadow-2xl text-slate-100 relative max-h-[90vh] flex flex-col space-y-4">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-cyan-950 border border-cyan-500/50 rounded-xl text-cyan-400">
              <Cloud size={24} />
            </div>
            <div>
              <h2 className="font-pixel text-base sm:text-lg text-cyan-300">Nuvem Google Drive</h2>
              <p className="font-mono text-xs text-slate-400">Sincronize seu savegame em qualquer computador ou dispositivo</p>
            </div>
          </div>
          <button
            onClick={() => {
              sound.playSelect();
              onClose();
            }}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Status Alerts */}
        {statusMessage && (
          <div
            className={`p-3 rounded-xl flex items-center gap-2.5 text-xs font-mono border ${
              statusMessage.type === 'success'
                ? 'bg-emerald-950/80 border-emerald-500/80 text-emerald-300'
                : statusMessage.type === 'error'
                ? 'bg-rose-950/80 border-rose-500/80 text-rose-300'
                : 'bg-cyan-950/80 border-cyan-500/80 text-cyan-300'
            }`}
          >
            {statusMessage.type === 'success' && <CheckCircle2 size={16} className="shrink-0" />}
            {statusMessage.type === 'error' && <AlertCircle size={16} className="shrink-0" />}
            {statusMessage.type === 'info' && <ShieldCheck size={16} className="shrink-0" />}
            <span className="flex-1">{statusMessage.text}</span>
          </div>
        )}

        {/* Auth Box */}
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          {user ? (
            <>
              <div className="flex items-center gap-3">
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || 'Google User'}
                    className="w-10 h-10 rounded-full border border-cyan-500"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-cyan-900 border border-cyan-500 flex items-center justify-center font-pixel text-cyan-300">
                    {user.displayName?.charAt(0) || 'G'}
                  </div>
                )}
                <div>
                  <div className="font-pixel text-xs text-cyan-300">{user.displayName || 'Jogador Conectado'}</div>
                  <div className="font-mono text-[11px] text-slate-400">{user.email}</div>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={handleLogout}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-mono text-slate-300 flex items-center gap-1.5 transition-colors border border-slate-700"
                >
                  <LogOut size={13} /> Sair
                </button>
              </div>
            </>
          ) : (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 w-full">
              <div className="space-y-0.5 text-center sm:text-left">
                <div className="font-pixel text-xs text-amber-300">Google Drive não conectado</div>
                <div className="font-mono text-xs text-slate-400">
                  Faça login para salvar na nuvem e carregar seus dados em qualquer lugar.
                </div>
              </div>

              {/* Official styled Google Sign-in button */}
              <button
                onClick={handleLogin}
                disabled={loading}
                className="bg-white hover:bg-slate-100 text-slate-800 font-sans font-medium text-xs px-4 py-2 rounded-lg flex items-center gap-2.5 transition-all shadow-md active:scale-95 shrink-0 border border-slate-300 disabled:opacity-50 cursor-pointer"
              >
                <svg className="w-4 h-4" viewBox="0 0 48 48">
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                </svg>
                <span>Entrar com Google</span>
              </button>
            </div>
          )}
        </div>

        {/* Cloud Actions and Save List */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1 custom-scrollbar min-h-[220px]">
          {user ? (
            <>
              {/* Quick Save Card */}
              <div className="bg-gradient-to-r from-cyan-950/40 via-slate-900 to-cyan-950/40 border border-cyan-500/40 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="space-y-1 text-center sm:text-left">
                  <div className="font-pixel text-xs text-cyan-300 flex items-center justify-center sm:justify-start gap-1.5">
                    <Sparkles size={14} className="text-amber-400" /> Salvar Progresso Atual
                  </div>
                  <div className="font-mono text-[11px] text-slate-300">
                    {playerCreature ? (
                      <span>
                        Criatura: <strong>{playerCreature.name}</strong> (Lv {playerCreature.level}) • Moedas: {userCoins}🪙
                      </span>
                    ) : (
                      <span>Nenhum personagem ativo selecionado</span>
                    )}
                  </div>
                </div>

                <button
                  onClick={handleSaveToDrive}
                  disabled={loading || !playerCreature}
                  className="w-full sm:w-auto px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-pixel text-xs flex items-center justify-center gap-2 transition-all shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <CloudUpload size={16} /> Salvar no Google Drive
                </button>
              </div>

              {/* Drive File List */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-mono text-slate-400 px-1">
                  <span className="flex items-center gap-1.5">
                    <HardDrive size={14} /> Saves no Google Drive ({driveFiles.length})
                  </span>
                  <button
                    onClick={loadFiles}
                    disabled={loading}
                    className="hover:text-cyan-300 flex items-center gap-1 transition-colors"
                  >
                    <RefreshCw size={12} className={loading ? 'animate-spin' : ''} /> Atualizar
                  </button>
                </div>

                {driveFiles.length === 0 ? (
                  <div className="bg-slate-950/60 border border-dashed border-slate-800 rounded-xl p-8 text-center font-mono text-xs text-slate-500 space-y-2">
                    <Cloud size={32} className="mx-auto text-slate-600 opacity-60" />
                    <div>Nenhum arquivo de save encontrado na sua pasta do Google Drive.</div>
                    <div className="text-[11px] text-slate-600">Clique no botão "Salvar no Google Drive" acima para criar seu primeiro save em nuvem!</div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {driveFiles.map((file) => (
                      <div
                        key={file.id}
                        className="bg-slate-950 border border-slate-800 hover:border-cyan-500/50 rounded-xl p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 transition-all"
                      >
                        <div className="space-y-1">
                          <div className="font-pixel text-xs text-amber-300 flex items-center gap-2">
                            <span>{file.name}</span>
                          </div>
                          <div className="flex items-center gap-3 font-mono text-[10px] text-slate-400">
                            <span className="flex items-center gap-1">
                              <Clock size={11} /> {new Date(file.modifiedTime).toLocaleString()}
                            </span>
                            {file.description && <span className="text-slate-500">| {file.description}</span>}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                          <button
                            onClick={() => setFileToLoad(file)}
                            className="px-3 py-1.5 rounded-lg bg-cyan-950 hover:bg-cyan-900 border border-cyan-500/80 text-cyan-300 font-pixel text-[10px] flex items-center gap-1.5 transition-colors"
                          >
                            <CloudDownload size={13} /> Carregar
                          </button>
                          <button
                            onClick={() => setFileToDelete(file)}
                            className="p-1.5 rounded-lg bg-rose-950/60 hover:bg-rose-900 border border-rose-500/60 text-rose-300 transition-colors"
                            title="Excluir save do Google Drive"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-8 text-center space-y-4">
              <Cloud size={40} className="mx-auto text-cyan-400 animate-pulse" />
              <div className="space-y-1">
                <h3 className="font-pixel text-sm text-cyan-300">Conecte sua conta do Google</h3>
                <p className="font-mono text-xs text-slate-400 max-w-md mx-auto">
                  Com o Google Drive integrado, você nunca perderá o nível da sua criatura, moedas conquistadas e chefes derrotados, podendo jogar em qualquer lugar!
                </p>
              </div>
              <button
                onClick={handleLogin}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-pixel text-xs shadow-lg transition-all active:scale-95"
              >
                Conectar com Google Drive Agora
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-slate-800 pt-3 flex items-center justify-between text-[11px] font-mono text-slate-400">
          <span>Pasta de destino: <strong>/Batalha das Funções - Saves</strong></span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-mono"
          >
            Fechar
          </button>
        </div>

        {/* Explicit Confirmation Modal for Loading Save (Overwriting data) */}
        {fileToLoad && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fade-in">
            <div className="bg-slate-900 border-2 border-cyan-500 rounded-2xl max-w-md w-full p-5 space-y-4 text-center shadow-2xl">
              <div className="p-3 bg-cyan-950 text-cyan-300 w-12 h-12 rounded-full mx-auto flex items-center justify-center border border-cyan-500">
                <CloudDownload size={24} />
              </div>
              <div className="space-y-1">
                <h3 className="font-pixel text-sm text-cyan-300">Carregar Progresso da Nuvem?</h3>
                <p className="font-mono text-xs text-slate-300">
                  Deseja carregar o save <strong>"{fileToLoad.name}"</strong>? O progresso não salvo da sessão atual será substituído pelos dados do arquivo.
                </p>
              </div>
              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => setFileToLoad(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-xs"
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmLoadFile}
                  disabled={loading}
                  className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-pixel text-xs flex items-center gap-2"
                >
                  Confirmar e Carregar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Explicit Confirmation Modal for Deleting Save (Destructive operation mandated by rules) */}
        {fileToDelete && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fade-in">
            <div className="bg-slate-900 border-2 border-rose-500 rounded-2xl max-w-md w-full p-5 space-y-4 text-center shadow-2xl">
              <div className="p-3 bg-rose-950 text-rose-400 w-12 h-12 rounded-full mx-auto flex items-center justify-center border border-rose-500">
                <AlertTriangle size={24} />
              </div>
              <div className="space-y-1">
                <h3 className="font-pixel text-sm text-rose-300">Excluir Save do Google Drive?</h3>
                <p className="font-mono text-xs text-slate-300">
                  Tem certeza que deseja excluir permanentemente o arquivo <strong>"{fileToDelete.name}"</strong> da sua conta Google Drive? Esta ação não pode ser desfeita.
                </p>
              </div>
              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => setFileToDelete(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-xs"
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmDeleteFile}
                  disabled={loading}
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-pixel text-xs flex items-center gap-2"
                >
                  Confirmar Exclusão
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
