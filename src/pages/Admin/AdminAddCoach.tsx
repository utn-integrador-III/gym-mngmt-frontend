import { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/trainers/assignRoutine.css";

import { login } from "../../services/authService";
import { usersApi } from "../../services/usersService";

const ROLE_COACH_API = "entrenador";

type NewCoach = {
  name: string;
  email: string;
  password: string;
  username?: string;
  phone?: string;
  photo?: string;
  gender?: string;  
  role?: string;    
};

const isEmail = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s.trim());

const emptyCoach: NewCoach = {
  name: "",
  email: "",
  password: "",
  username: "",
  phone: "",
  photo: "",
  gender: "",
  role: ROLE_COACH_API,
};

export default function AdminRegistrarEntrenador() {
  const navigate = useNavigate();
  const GO_BACK = "../";

  // Sesión admin
  const [adminLogged, setAdminLogged] = useState<boolean>(
    !!localStorage.getItem("admin_id")
  );

  // Login admin
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPass, setAdminPass] = useState("");
  const [showPass, setShowPass] = useState(false);

  // Form "Insertar entrenador"
  const [coach, setCoach] = useState<NewCoach>({ ...emptyCoach });

  // Foto (archivo) 
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string>("");

  // UI state
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [recentUserId, setRecentUserId] = useState<string | number | null>(null);

  const canLogin = useMemo(
    () => isEmail(adminEmail) && adminPass.trim().length >= 3,
    [adminEmail, adminPass]
  );

  const canCreate = useMemo(() => {
    if (!coach.name.trim()) return false;
    if (!isEmail(coach.email)) return false;
    if (coach.password.trim().length < 4) return false;
    return true;
  }, [coach]);

  const setField = <K extends keyof NewCoach>(k: K, v: NewCoach[K]) =>
    setCoach((c) => ({ ...c, [k]: v }));

  // preview de archivo
  useEffect(() => {
    if (!photoFile) {
      setPhotoPreview("");
      return;
    }
    const url = URL.createObjectURL(photoFile);
    setPhotoPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [photoFile]);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.currentTarget.files?.[0] || null;
    if (!f) {
      setPhotoFile(null);
      setPhotoPreview("");
      return;
    }
    if (!f.type.startsWith("image/")) {
      setError("El archivo debe ser una imagen.");
      return;
    }
    // límite 5 MB
    if (f.size > 5 * 1024 * 1024) {
      setError("La foto no puede exceder 5 MB.");
      return;
    }
    setError(null);
    setPhotoFile(f);
  };

  // --------- Handlers ----------
  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setBusy(true);
    try {
      const resp = await login({
        email: adminEmail.trim().toLowerCase(),
        password: adminPass,
      });
      // persiste mínimos para sesión (opcional)
      localStorage.setItem("admin_id", resp.id);
      localStorage.setItem("admin_role", resp.role);

      setAdminLogged(true);
      setSuccessMsg("Sesión de administrador iniciada.");
    } catch (err: any) {
      console.error(err);
      const msg = String(err?.message || "");
      if (msg.includes("Database unavailable") || msg.includes("[503]")) {
        setError("No hay conexión con la base de datos. Intenta más tarde.");
      } else if (msg.includes("[401]")) {
        setError("Credenciales inválidas.");
      } else {
        setError("Error al iniciar sesión.");
      }
    } finally {
      setBusy(false);
    }
  };

  const handleLogoutAdmin = () => {
    setAdminLogged(false);
    setSuccessMsg(null);
    setError(null);
  };

  const handleCreateCoach = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setRecentUserId(null);

    if (!adminLogged) {
      setError("Debes iniciar sesión como administrador primero.");
      return;
    }
    if (!canCreate) {
      setError("Completa Nombre, Email válido y una Contraseña (mínimo 4).");
      return;
    }

    setBusy(true);
    try {
      const fd = new FormData();

      const username = (coach.username || coach.name).trim();

      fd.append("username", username);
      fd.append("email", coach.email.trim().toLowerCase());
      fd.append("password", coach.password);
      fd.append("role", ROLE_COACH_API);

      if (coach.phone?.trim()) fd.append("phone", coach.phone.trim());
      if (coach.gender) fd.append("gender", coach.gender);

      
      if (photoFile) {
        fd.append("photo", photoFile, photoFile.name);
      }


      const data = await usersApi.create(fd);
      const newId = (data as any)?._id ?? (data as any)?.id ?? null;

      setRecentUserId(newId);
      setSuccessMsg("¡Entrenador insertado con éxito!");
      setCoach({ ...emptyCoach });
      setPhotoFile(null);
      setPhotoPreview("");
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "Error al registrar entrenador.");
    } finally {
      setBusy(false);
    }
  };

  const previewSrc = photoPreview || (coach.photo?.startsWith("http") ? coach.photo : "");

  return (
    <div className="assign-container">
      <button
        type="button"
        className="btn back"
        onClick={() => navigate(GO_BACK)}
      >
        ← Volver
      </button>

      <h2 className="assign-title">Bienvenido, administrador</h2>

      {/* Login admin  */}
      {!adminLogged ? (
        <form className="assign-card" onSubmit={handleAdminLogin}>
          <div className="form-row">
            <label className="lbl">Correo administrador</label>
            <input
              type="email"
              className="in"
              placeholder="admin@example.com"
              value={adminEmail}
              onChange={(e) => setAdminEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-row">
            <label className="lbl">Contraseña</label>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <input
                type={showPass ? "text" : "password"}
                className="in"
                placeholder="••••••••"
                value={adminPass}
                onChange={(e) => setAdminPass(e.target.value)}
                required
              />
              <button
                type="button"
                className="btn ghost"
                onClick={() => setShowPass((s) => !s)}
                title={showPass ? "Ocultar" : "Mostrar"}
              >
                {showPass ? "Ocultar" : "Ver"}
              </button>
            </div>
          </div>

          {error && (
            <div className="msg error" role="alert" aria-live="assertive">
              {error}
            </div>
          )}
          {successMsg && (
            <div className="msg ok" role="status" aria-live="polite">
              {successMsg}
            </div>
          )}

          <div className="footer">
            <button type="submit" className="btn primary" disabled={!canLogin || busy}>
              {busy ? "Entrando…" : "Entrar como Admin"}
            </button>
          </div>
        </form>
      ) : (
        
        <form className="assign-card" onSubmit={handleCreateCoach}>
          <div className="rows-head">
            <span>Insertar entrenador</span>
            <div className="rows-actions">
              <button
                type="button"
                className="btn ghost"
                onClick={handleLogoutAdmin}
                title="Cerrar sesión admin (solo esta vista)"
              >
                Cerrar admin
              </button>
            </div>
          </div>

          <div className="form-row">
            <label className="lbl">Nombre *</label>
            <input
              className="in"
              value={coach.name}
              onChange={(e) => setField("name", e.target.value)}
              placeholder="Ej. Ana Coach"
              required
            />
          </div>

          <div className="form-row">
            <label className="lbl">Email *</label>
            <input
              type="email"
              className="in"
              value={coach.email}
              onChange={(e) => setField("email", e.target.value)}
              placeholder="ana.coach@gym.com"
              required
            />
          </div>

          <div className="form-row">
            <label className="lbl">Contraseña *</label>
            <input
              type="password"
              className="in"
              value={coach.password}
              onChange={(e) => setField("password", e.target.value)}
              placeholder="Contraseña inicial"
              required
            />
          </div>

          <div className="form-row">
            <label className="lbl">Rol</label>
            <input className="in" value={`entrenador → ${ROLE_COACH_API}`} disabled />
          </div>

          <div className="form-row">
            <label className="lbl">Usuario</label>
            <input
              className="in"
              value={coach.username}
              onChange={(e) => setField("username", e.target.value)}
              placeholder="ana.fit"
            />
          </div>

          <div className="form-row">
            <label className="lbl">Teléfono</label>
            <input
              className="in"
              value={coach.phone}
              onChange={(e) => setField("phone", e.target.value)}
              placeholder="+506 8888-8888"
            />
          </div>

       
          <div className="form-row">
            <label className="lbl">Foto (archivo)</label>
            <input
              type="file"
              accept="image/*"
              className="in"
              onChange={handlePhotoChange}
            />
            {previewSrc && (
              <div style={{ marginTop: 8 }}>
                <img
                  src={previewSrc}
                  alt="Vista previa"
                  style={{ maxWidth: 160, maxHeight: 160, borderRadius: 12 }}
                />
              </div>
            )}
          </div>

          <div className="form-row">
            <label className="lbl">Género</label>
            <select
              className="in sel"
              value={coach.gender || ""}
              onChange={(e) => setField("gender", e.target.value)}
            >
              <option value="">— Seleccionar —</option>
              <option value="male">Masculino</option>
              <option value="female">Femenino</option>
            </select>
          </div>

          {error && (
            <div className="msg error" role="alert" aria-live="assertive">
              {error}
            </div>
          )}
          {successMsg && (
            <div className="msg ok" role="status" aria-live="polite">
              {successMsg}
            </div>
          )}

          <div className="footer">
            <button
              type="submit"
              className="btn primary"
              disabled={busy || !canCreate}
            >
              {busy ? "Guardando…" : "Insertar entrenador"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
