"use client";

import { ChangeEvent, FormEvent, useCallback, useRef, useState } from "react";
import Cropper, { Area } from "react-easy-crop";

interface CropPoint {
  x: number;
  y: number;
}

function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
        return;
      }

      reject(new Error("Failed to read file"));
    };

    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
}

function loadImage(imageSrc: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();

    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Failed to load image"));
    image.src = imageSrc;
  });
}

async function getCroppedAvatarFile(params: {
  imageSrc: string;
  crop: Area;
  originalFileName: string;
  mimeType?: string;
}) {
  const { imageSrc, crop, originalFileName, mimeType = "image/jpeg" } = params;
  const image = await loadImage(imageSrc);

  const canvas = document.createElement("canvas");
  canvas.width = crop.width;
  canvas.height = crop.height;

  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("Canvas context is not available");
  }

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";

  ctx.drawImage(
    image,
    crop.x,
    crop.y,
    crop.width,
    crop.height,
    0,
    0,
    crop.width,
    crop.height,
  );

  const blob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob(resolve, mimeType, 0.92);
  });

  if (!blob) {
    throw new Error("Failed to export cropped image");
  }

  const safeBaseName = originalFileName.replace(/\.[^/.]+$/, "").slice(0, 40) || "avatar";

  return new File([blob], `${safeBaseName}-square.jpg`, {
    type: mimeType,
    lastModified: Date.now(),
  });
}

export function AdminCreateUserForm() {
  const formRef = useRef<HTMLFormElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [crop, setCrop] = useState<CropPoint>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [cropPixels, setCropPixels] = useState<Area | null>(null);
  const [cropError, setCropError] = useState<string | null>(null);
  const [isPreparingImage, setIsPreparingImage] = useState(false);

  const handleFileChange = useCallback(async (event: ChangeEvent<HTMLInputElement>) => {
    setCropError(null);

    const file = event.target.files?.[0];
    if (!file) {
      setImageSrc(null);
      setFileName("");
      return;
    }

    setIsPreparingImage(true);

    try {
      const dataUrl = await readFileAsDataUrl(file);
      setImageSrc(dataUrl);
      setFileName(file.name);
      setCrop({ x: 0, y: 0 });
      setZoom(1);
      setCropPixels(null);
    } catch {
      setCropError("Не удалось открыть изображение. Попробуйте другой файл.");
      setImageSrc(null);
      setFileName("");
    } finally {
      setIsPreparingImage(false);
    }
  }, []);

  const handleCropComplete = useCallback((_: Area, croppedAreaPixels: Area) => {
    setCropPixels(croppedAreaPixels);
  }, []);

  const handleSubmit = useCallback(async (event: FormEvent<HTMLFormElement>) => {
    if (!imageSrc) {
      return;
    }

    event.preventDefault();
    setCropError(null);

    const sourceFile = fileInputRef.current?.files?.[0];

    if (!sourceFile || !cropPixels || !formRef.current || !fileInputRef.current) {
      setCropError("Сначала выберите фото и настройте квадратную область.");
      return;
    }

    try {
      const croppedAvatar = await getCroppedAvatarFile({
        imageSrc,
        crop: cropPixels,
        originalFileName: sourceFile.name,
      });

      const dt = new DataTransfer();
      dt.items.add(croppedAvatar);
      fileInputRef.current.files = dt.files;

      formRef.current.submit();
    } catch {
      setCropError("Не удалось подготовить квадратный аватар. Попробуйте ещё раз.");
    }
  }, [cropPixels, imageSrc]);

  return (
    <form
      ref={formRef}
      action="/api/admin/users"
      method="post"
      encType="multipart/form-data"
      className="mt-4 grid gap-3 md:grid-cols-2"
      onSubmit={handleSubmit}
    >
      <label className="text-sm font-medium">
        ID (цифры)
        <input
          name="identifier"
          required
          inputMode="numeric"
          minLength={3}
          maxLength={12}
          className="mt-1 w-full rounded-xl border border-[var(--line)] bg-white px-3 py-2 text-sm"
        />
      </label>

      <label className="text-sm font-medium">
        Роль
        <select
          name="role"
          defaultValue="USER"
          className="mt-1 w-full rounded-xl border border-[var(--line)] bg-white px-3 py-2 text-sm"
        >
          <option value="USER">Обычный пользователь</option>
          <option value="ADMIN">Администратор</option>
        </select>
      </label>

      <label className="text-sm font-medium md:col-span-2">
        Имя
        <input
          name="displayName"
          required
          minLength={2}
          maxLength={60}
          className="mt-1 w-full rounded-xl border border-[var(--line)] bg-white px-3 py-2 text-sm"
        />
      </label>

      <label className="text-sm font-medium md:col-span-2">
        Username (опционально)
        <div className="mt-1 flex items-center rounded-xl border border-[var(--line)] bg-white px-3">
          <span className="text-sm text-[var(--text-muted)]">@</span>
          <input
            name="username"
            minLength={3}
            maxLength={24}
            pattern="[a-z0-9_]{3,24}"
            className="w-full bg-transparent px-1 py-2 text-sm outline-none"
            placeholder="nikita_3fvt"
          />
        </div>
      </label>

      <label className="text-sm font-medium md:col-span-2">
        Фото профиля (опционально)
        <input
          ref={fileInputRef}
          name="avatar"
          type="file"
          accept="image/png,image/jpeg,image/webp"
          onChange={handleFileChange}
          className="mt-1 w-full rounded-xl border border-[var(--line)] bg-white px-3 py-2 text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-[var(--card-muted)] file:px-3 file:py-1.5"
        />
      </label>

      {imageSrc ? (
        <div className="md:col-span-2 rounded-2xl border border-[var(--line)] bg-[var(--card-muted)] p-3">
          <p className="text-xs text-[var(--text-muted)]">
            Квадратный аватар 1:1. Перемещайте фото и настраивайте масштаб.
          </p>
          <p className="mt-1 truncate text-xs text-[var(--text-muted)]">Файл: {fileName}</p>

          <div className="relative mt-3 h-64 w-full overflow-hidden rounded-xl border border-[var(--line)] bg-black/5">
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              aspect={1}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={handleCropComplete}
              showGrid={false}
              objectFit="contain"
            />
          </div>

          <label className="mt-3 block text-xs text-[var(--text-muted)]">
            Масштаб
            <input
              type="range"
              min={1}
              max={3}
              step={0.01}
              value={zoom}
              onChange={(event) => setZoom(Number(event.target.value))}
              className="mt-1 w-full accent-[var(--accent)]"
            />
          </label>
        </div>
      ) : null}

      {isPreparingImage ? (
        <p className="md:col-span-2 text-xs text-[var(--text-muted)]">Подготавливаем изображение...</p>
      ) : null}

      {cropError ? (
        <p className="md:col-span-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-[var(--danger)]">
          {cropError}
        </p>
      ) : null}

      <label className="text-sm font-medium">
        Возраст
        <input
          name="age"
          type="number"
          min={14}
          max={99}
          className="mt-1 w-full rounded-xl border border-[var(--line)] bg-white px-3 py-2 text-sm"
        />
      </label>

      <label className="text-sm font-medium">
        Дата рождения
        <input
          name="birthDate"
          type="date"
          className="mt-1 w-full rounded-xl border border-[var(--line)] bg-white px-3 py-2 text-sm"
        />
      </label>

      <label className="text-sm font-medium md:col-span-2">
        Bio (опционально)
        <textarea
          name="bio"
          rows={3}
          maxLength={280}
          className="mt-1 w-full rounded-xl border border-[var(--line)] bg-white px-3 py-2 text-sm"
        />
      </label>

      <label className="text-sm font-medium md:col-span-2">
        Пароль
        <input
          name="password"
          type="password"
          required
          minLength={8}
          maxLength={128}
          className="mt-1 w-full rounded-xl border border-[var(--line)] bg-white px-3 py-2 text-sm"
        />
      </label>

      <button
        type="submit"
        className="md:col-span-2 rounded-xl bg-[var(--accent)] px-4 py-2.5 text-sm font-semibold text-white"
      >
        Создать аккаунт
      </button>
    </form>
  );
}
