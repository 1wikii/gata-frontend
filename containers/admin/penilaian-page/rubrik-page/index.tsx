"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  Loader2,
  Save,
  RefreshCw,
} from "lucide-react";
import { penilaianApiClient } from "@/utils/penilaianApi";
import type {
  Rubrik,
  RubrikGroup,
  Pertanyaan,
  OpsiJawaban,
  RentangNilai,
} from "@/types/penilaian";

// Extended types for UI state with selection
interface OpsiJawabanUI extends OpsiJawaban {
  selected: boolean;
}

interface PertanyaanUI extends Omit<Pertanyaan, "opsiJawaban"> {
  opsiJawaban: OpsiJawabanUI[];
}

interface GroupUI extends Omit<RubrikGroup, "pertanyaans"> {
  pertanyaans: PertanyaanUI[];
}

interface RubrikUI extends Omit<Rubrik, "groups"> {
  groups: GroupUI[];
}

const RubrikPage = () => {
  const [rubrikList, setRubrikList] = useState<RubrikUI[]>([]);
  const [selectedRubrikId, setSelectedRubrikId] = useState<string>("");
  const [newRubrikName, setNewRubrikName] = useState("");
  const [newRubrikType, setNewRubrikType] = useState<"SID" | "SEM">("SID");
  const [showArsipOnly, setShowArsipOnly] = useState(false);
  const [rentangNilai, setRentangNilai] = useState<RentangNilai[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Helper: Convert API response to normalized format
  const normalizeOpsiJawaban = (opsi: any): OpsiJawaban => {
    return {
      id: opsi.id,
      pertanyaanId: opsi.pertanyaanId,
      text: opsi.text,
      nilai:
        typeof opsi.nilai === "string" ? parseFloat(opsi.nilai) : opsi.nilai,
      urutan:
        typeof opsi.urutan === "string" ? parseInt(opsi.urutan) : opsi.urutan,
      createdAt: opsi.createdAt,
      updatedAt: opsi.updatedAt,
    };
  };

  const normalizePertanyaan = (pertanyaan: any): PertanyaanUI => {
    const opsiJawaban = (
      pertanyaan.opsiJawabans ||
      pertanyaan.opsiJawaban ||
      []
    ).map((opsi: any) => ({
      ...normalizeOpsiJawaban(opsi),
      selected: false,
    }));

    return {
      id: pertanyaan.id,
      groupId: pertanyaan.groupId,
      text: pertanyaan.text,
      bobot:
        typeof pertanyaan.bobot === "string"
          ? parseFloat(pertanyaan.bobot)
          : pertanyaan.bobot,
      urutan:
        typeof pertanyaan.urutan === "string"
          ? parseInt(pertanyaan.urutan)
          : pertanyaan.urutan,
      createdAt: pertanyaan.createdAt,
      updatedAt: pertanyaan.updatedAt,
      opsiJawaban,
    };
  };

  const normalizeGroup = (group: any): GroupUI => {
    return {
      id: group.id,
      rubrikId: group.rubrikId,
      nama: group.nama,
      bobotTotal:
        typeof group.bobotTotal === "string"
          ? parseFloat(group.bobotTotal)
          : group.bobotTotal,
      urutan:
        typeof group.urutan === "string"
          ? parseInt(group.urutan)
          : group.urutan,
      createdAt: group.createdAt,
      updatedAt: group.updatedAt,
      pertanyaans: (group.pertanyaans || []).map(normalizePertanyaan),
    };
  };

  const normalizeRubrik = (rubrik: any): RubrikUI => {
    return {
      id: rubrik.id,
      nama: rubrik.nama,
      deskripsi: rubrik.deskripsi,
      type: rubrik.type,
      isDefault: rubrik.isDefault,
      isActive: rubrik.isActive,
      createdAt: rubrik.createdAt,
      updatedAt: rubrik.updatedAt,
      groups: (rubrik.groups || []).map(normalizeGroup),
    };
  };

  // Load rubrik list
  const loadRubrikList = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await penilaianApiClient.rubrik.getAll(
        showArsipOnly ? { showArchived: true } : undefined
      );

      if (response?.data) {
        const dataArray = Array.isArray(response.data) ? response.data : [];

        const converted = dataArray.map(normalizeRubrik);

        setRubrikList(converted);

        // Auto-select first rubrik jika belum ada yang dipilih
        if (converted.length > 0) {
          setSelectedRubrikId((prev) => prev || converted[0].id);
        }
      } else {
        setError(response?.message || "Gagal memuat rubrik");
        setRubrikList([]);
      }
    } catch (err) {
      console.error("✗ ERROR loading rubrik:", err);
      setError(err instanceof Error ? err.message : "Terjadi kesalahan");
      setRubrikList([]);
    } finally {
      setLoading(false);
    }
  }, [showArsipOnly]);

  // Load rentang nilai
  const loadRentangNilai = useCallback(async () => {
    try {
      const response = await penilaianApiClient.rentangNilai.getAll();

      if (response?.data && Array.isArray(response.data)) {
        const normalized = (response.data as any[]).map((r: any) => ({
          ...r,
          minScore:
            typeof r.minScore === "string"
              ? parseFloat(r.minScore)
              : r.minScore,
        }));

        setRentangNilai(normalized);
      } else {
        setRentangNilai([]);
      }
    } catch (err) {
      console.error("Failed to load rentang nilai:", err);
      setRentangNilai([]);
    }
  }, []);

  // Initial load on mount
  useEffect(() => {
    loadRubrikList();
    loadRentangNilai();
  }, [loadRubrikList, loadRentangNilai]);

  const selectedRubrik = rubrikList.find((r) => r.id === selectedRubrikId);

  // ===== RUBRIK OPERATIONS =====
  const handleAddRubrik = async () => {
    if (!newRubrikName.trim()) return;

    try {
      setSaving(true);
      const response = await penilaianApiClient.rubrik.create({
        nama: newRubrikName,
        deskripsi: "",
        type: newRubrikType,
      });

      if (!response.errors && response.data) {
        const converted = normalizeRubrik(response.data);
        const newList = [...rubrikList, converted];
        setRubrikList(newList);
        setNewRubrikName("");
        setSelectedRubrikId(converted.id);
        alert("Rubrik berhasil dibuat!");
      } else {
        alert(response.message || "Gagal membuat rubrik");
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : "Terjadi kesalahan");
      console.error("Error creating rubrik:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveRubrik = async () => {
    if (!selectedRubrik) return;

    try {
      setSaving(true);
      const response = await penilaianApiClient.rubrik.update(
        selectedRubrik.id,
        {
          nama: selectedRubrik.nama,
          deskripsi: selectedRubrik.deskripsi,
        }
      );

      if (!response.errors) {
        alert("Rubrik berhasil disimpan!");
        loadRubrikList();
      } else {
        alert(response.message || "Gagal menyimpan rubrik");
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : "Terjadi kesalahan");
    } finally {
      setSaving(false);
    }
  };

  const handleDuplicateRubrik = async (rubrikId: string) => {
    try {
      const response = await penilaianApiClient.rubrik.duplicate(rubrikId);
      if (!response.errors) {
        loadRubrikList();
      } else {
        alert(response.message || "Gagal menduplikasi rubrik");
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : "Terjadi kesalahan");
    }
  };

  const handleDeleteRubrik = async (rubrikId: string) => {
    if (!confirm("Hapus rubrik ini?")) return;

    try {
      const response = await penilaianApiClient.rubrik.delete(rubrikId);
      if (!response.errors) {
        loadRubrikList();
        if (selectedRubrikId === rubrikId) {
          setSelectedRubrikId(rubrikList[0]?.id || "");
        }
      } else {
        alert(response.message || "Gagal menghapus rubrik");
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : "Terjadi kesalahan");
    }
  };

  const handleSetDefault = async (rubrikId: string, type: "SEM" | "SID") => {
    try {
      const response = await penilaianApiClient.rubrik.setDefault(
        rubrikId,
        type
      );
      if (!response.errors) {
        loadRubrikList();
      } else {
        alert(response.message || "Gagal set default");
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : "Terjadi kesalahan");
    }
  };

  // ===== GROUP OPERATIONS =====
  const handleAddGroup = async () => {
    if (!selectedRubrik) return;

    try {
      setSaving(true);
      const maxUrutan = Math.max(
        ...selectedRubrik.groups.map((g) => g.urutan),
        0
      );
      const groupPayload = {
        nama: "Group Baru",
        bobotTotal: 0,
        urutan: maxUrutan + 1,
      };

      const response = await penilaianApiClient.group.create(
        selectedRubrik.id,
        groupPayload
      );

      if (!response.errors && response.data) {
        // Add group directly to UI without reload
        const newGroup = normalizeGroup(response.data);

        setRubrikList(
          rubrikList.map((r) =>
            r.id === selectedRubrikId
              ? {
                  ...r,
                  groups: [...r.groups, newGroup],
                }
              : r
          )
        );
        alert("Group berhasil ditambahkan!");
      } else {
        alert(response.message || "Gagal menambah group");
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : "Terjadi kesalahan");
      console.error("Error adding group:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateGroup = async (
    groupId: string,
    field: "nama" | "bobotTotal",
    value: string | number
  ) => {
    try {
      await penilaianApiClient.group.update(groupId, { [field]: value });
      // Update local state optimistically
      setRubrikList(
        rubrikList.map((r) =>
          r.id === selectedRubrikId
            ? {
                ...r,
                groups: r.groups.map((g) =>
                  g.id === groupId ? { ...g, [field]: value } : g
                ),
              }
            : r
        )
      );
    } catch (err) {
      alert(err instanceof Error ? err.message : "Terjadi kesalahan");
    }
  };

  const handleDeleteGroup = async (groupId: string) => {
    if (!confirm("Hapus group ini?")) return;

    try {
      const response = await penilaianApiClient.group.delete(groupId);
      if (!response.errors) {
        loadRubrikList();
      } else {
        alert(response.message || "Gagal menghapus group");
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : "Terjadi kesalahan");
    }
  };

  const handleReorderGroup = async (
    groupId: string,
    direction: "up" | "down"
  ) => {
    if (!selectedRubrik) return;

    const index = selectedRubrik.groups.findIndex((g) => g.id === groupId);
    if (index === -1) return;

    const newGroups = [...selectedRubrik.groups];
    if (direction === "up" && index > 0) {
      [newGroups[index], newGroups[index - 1]] = [
        newGroups[index - 1],
        newGroups[index],
      ];
    } else if (direction === "down" && index < newGroups.length - 1) {
      [newGroups[index], newGroups[index + 1]] = [
        newGroups[index + 1],
        newGroups[index],
      ];
    } else {
      return;
    }

    try {
      await penilaianApiClient.group.reorder(selectedRubrik.id, {
        items: newGroups.map((g, idx) => ({ id: g.id, urutan: idx + 1 })),
      });

      setRubrikList(
        rubrikList.map((r) =>
          r.id === selectedRubrikId ? { ...r, groups: newGroups } : r
        )
      );
    } catch (err) {
      alert(err instanceof Error ? err.message : "Terjadi kesalahan");
    }
  };

  // ===== PERTANYAAN OPERATIONS =====
  const handleAddPertanyaan = async (groupId: string) => {
    if (!selectedRubrik) return;

    const group = selectedRubrik.groups.find((g) => g.id === groupId);
    if (!group) return;

    const maxUrutan = Math.max(...group.pertanyaans.map((p) => p.urutan), 0);

    try {
      const response = await penilaianApiClient.pertanyaan.create(groupId, {
        text: "",
        bobot: 0,
        urutan: maxUrutan + 1,
      });

      if (!response.errors) {
        loadRubrikList();
      } else {
        alert(response.message || "Gagal menambah pertanyaan");
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : "Terjadi kesalahan");
    }
  };

  const handleUpdatePertanyaan = async (
    pertanyaanId: string,
    field: "text" | "bobot" | "groupId",
    value: string | number
  ) => {
    try {
      await penilaianApiClient.pertanyaan.update(pertanyaanId, {
        [field]: value,
      });
      // Reload to get fresh data
      if (field === "groupId") {
        loadRubrikList();
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : "Terjadi kesalahan");
    }
  };

  const handleDeletePertanyaan = async (pertanyaanId: string) => {
    if (!confirm("Hapus pertanyaan ini?")) return;

    try {
      const response = await penilaianApiClient.pertanyaan.delete(pertanyaanId);
      if (!response.errors) {
        loadRubrikList();
      } else {
        alert(response.message || "Gagal menghapus pertanyaan");
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : "Terjadi kesalahan");
    }
  };

  const handleDuplicatePertanyaan = async (pertanyaanId: string) => {
    try {
      const response = await penilaianApiClient.pertanyaan.duplicate(
        pertanyaanId
      );
      if (!response.errors) {
        loadRubrikList();
      } else {
        alert(response.message || "Gagal menduplikasi pertanyaan");
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : "Terjadi kesalahan");
    }
  };

  const handleReorderPertanyaan = async (
    groupId: string,
    pertanyaanId: string,
    direction: "up" | "down"
  ) => {
    if (!selectedRubrik) return;

    const group = selectedRubrik.groups.find((g) => g.id === groupId);
    if (!group) return;

    const index = group.pertanyaans.findIndex((p) => p.id === pertanyaanId);
    if (index === -1) return;

    const newPertanyaans = [...group.pertanyaans];
    if (direction === "up" && index > 0) {
      [newPertanyaans[index], newPertanyaans[index - 1]] = [
        newPertanyaans[index - 1],
        newPertanyaans[index],
      ];
    } else if (direction === "down" && index < newPertanyaans.length - 1) {
      [newPertanyaans[index], newPertanyaans[index + 1]] = [
        newPertanyaans[index + 1],
        newPertanyaans[index],
      ];
    } else {
      return;
    }

    try {
      await penilaianApiClient.pertanyaan.reorder(groupId, {
        items: newPertanyaans.map((p, idx) => ({ id: p.id, urutan: idx + 1 })),
      });

      setRubrikList(
        rubrikList.map((r) =>
          r.id === selectedRubrikId
            ? {
                ...r,
                groups: r.groups.map((g) =>
                  g.id === groupId ? { ...g, pertanyaans: newPertanyaans } : g
                ),
              }
            : r
        )
      );
    } catch (err) {
      alert(err instanceof Error ? err.message : "Terjadi kesalahan");
    }
  };

  // ===== OPSI JAWABAN OPERATIONS =====

  const handleAddOpsi = async (pertanyaanId: string) => {
    if (!selectedRubrik) return;

    let maxUrutan = 0;
    for (const group of selectedRubrik.groups) {
      const pertanyaan = group.pertanyaans.find((p) => p.id === pertanyaanId);
      if (pertanyaan) {
        maxUrutan = Math.max(...pertanyaan.opsiJawaban.map((o) => o.urutan), 0);
        break;
      }
    }

    try {
      const response = await penilaianApiClient.opsiJawaban.create(
        pertanyaanId,
        {
          text: "",
          nilai: 0,
          urutan: maxUrutan + 1,
        }
      );

      if (!response.errors) {
        loadRubrikList();
      } else {
        alert(response.message || "Gagal menambah opsi");
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : "Terjadi kesalahan");
    }
  };

  const handleUpdateOpsi = async (
    opsiId: string,
    field: "text" | "nilai",
    value: string | number
  ) => {
    try {
      await penilaianApiClient.opsiJawaban.update(opsiId, { [field]: value });
    } catch (err) {
      alert(err instanceof Error ? err.message : "Terjadi kesalahan");
    }
  };

  const handleDeleteOpsi = async (opsiId: string) => {
    if (!confirm("Hapus opsi ini?")) return;

    try {
      const response = await penilaianApiClient.opsiJawaban.delete(opsiId);
      if (!response.errors) {
        loadRubrikList();
      } else {
        alert(response.message || "Gagal menghapus opsi");
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : "Terjadi kesalahan");
    }
  };

  const handleDeleteSelectedOpsi = async (pertanyaanId: string) => {
    if (!selectedRubrik || !confirm("Hapus opsi terpilih?")) return;

    const opsiIds: string[] = [];
    for (const group of selectedRubrik.groups) {
      const pertanyaan = group.pertanyaans.find((p) => p.id === pertanyaanId);
      if (pertanyaan) {
        opsiIds.push(
          ...pertanyaan.opsiJawaban.filter((o) => o.selected).map((o) => o.id)
        );
        break;
      }
    }

    if (opsiIds.length === 0) {
      alert("Tidak ada opsi yang terpilih");
      return;
    }

    try {
      const response = await penilaianApiClient.opsiJawaban.bulkDelete(
        pertanyaanId,
        { opsiIds }
      );
      if (!response.errors) {
        loadRubrikList();
      } else {
        alert(response.message || "Gagal menghapus opsi");
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : "Terjadi kesalahan");
    }
  };

  // Toggle selection for opsi
  const toggleOpsiSelection = (
    groupId: string,
    pertanyaanId: string,
    opsiId: string
  ) => {
    setRubrikList(
      rubrikList.map((r) =>
        r.id === selectedRubrikId
          ? {
              ...r,
              groups: r.groups.map((g) =>
                g.id === groupId
                  ? {
                      ...g,
                      pertanyaans: g.pertanyaans.map((p) =>
                        p.id === pertanyaanId
                          ? {
                              ...p,
                              opsiJawaban: p.opsiJawaban.map((o) =>
                                o.id === opsiId
                                  ? { ...o, selected: !o.selected }
                                  : o
                              ),
                            }
                          : p
                      ),
                    }
                  : g
              ),
            }
          : r
      )
    );
  };

  // ===== RENTANG NILAI OPERATIONS =====
  const handleSaveRentangNilai = async () => {
    // Validate that all grade fields are filled
    const hasEmptyGrade = rentangNilai.some(
      (r) => !r.grade || r.grade.trim() === ""
    );
    if (hasEmptyGrade) {
      alert("Semua grade harus diisi!");
      return;
    }

    try {
      setSaving(true);

      // Separate new rentang (temp IDs) from existing ones
      const newRentang = rentangNilai.filter((r) => r.id.startsWith("temp-"));
      const existingRentang = rentangNilai.filter(
        (r) => !r.id.startsWith("temp-")
      );

      // Create new rentang first if any
      const createdRentang: RentangNilai[] = [];
      for (const rentang of newRentang) {
        const createResponse = await penilaianApiClient.rentangNilai.create({
          grade: rentang.grade,
          minScore: rentang.minScore,
          urutan: rentang.urutan,
        });

        if (!createResponse.errors && createResponse.data) {
          createdRentang.push(createResponse.data);
        } else {
          alert(
            createResponse.message || `Gagal membuat rentang ${rentang.grade}`
          );
          setSaving(false);
          return;
        }
      }

      // Prepare all rentang for bulk update (both existing and newly created)
      const allRentang = [...existingRentang, ...createdRentang];
      const payload = {
        rentangNilai: allRentang.map((r, idx) => ({
          id: r.id,
          grade: r.grade,
          minScore: r.minScore,
          urutan: idx + 1,
        })),
      };

      const response = await penilaianApiClient.rentangNilai.bulkUpdate(
        payload
      );

      if (response.ok || !response.errors) {
        alert("Rentang nilai berhasil disimpan!");
        loadRentangNilai();
      } else {
        alert(response?.message || "Gagal menyimpan rentang nilai");
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : "Terjadi kesalahan");
    } finally {
      setSaving(false);
    }
  };

  const handleAddRentang = () => {
    // Add new rentang locally without API call
    const maxUrutan =
      rentangNilai.length > 0
        ? Math.max(...rentangNilai.map((r) => r.urutan))
        : 0;

    const newRentang: RentangNilai = {
      id: `temp-${Date.now()}`, // Temporary ID, will be replaced on save
      grade: "",
      minScore: 0,
      maxScore: 0,
      urutan: maxUrutan + 1,
      isActive: true,
    };

    setRentangNilai([...rentangNilai, newRentang]);
  };

  const handleDeleteRentang = async (rentangId: string) => {
    if (!confirm("Hapus rentang nilai ini?")) return;

    try {
      setSaving(true);
      const response = await penilaianApiClient.rentangNilai.delete(rentangId);

      if (!response.errors) {
        setRentangNilai(rentangNilai.filter((r) => r.id !== rentangId));
        alert("Rentang nilai berhasil dihapus!");
      } else {
        alert(response.message || "Gagal menghapus rentang nilai");
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : "Terjadi kesalahan");
    } finally {
      setSaving(false);
    }
  };

  // Update rubrik field (local state)
  const updateRubrikField = (field: "nama" | "deskripsi", value: string) => {
    setRubrikList(
      rubrikList.map((r) =>
        r.id === selectedRubrikId ? { ...r, [field]: value } : r
      )
    );
  };

  // Update pertanyaan field (local state)
  const updatePertanyaanField = (
    groupId: string,
    pertanyaanId: string,
    field: "text" | "bobot" | "groupId",
    value: string | number
  ) => {
    setRubrikList(
      rubrikList.map((r) =>
        r.id === selectedRubrikId
          ? {
              ...r,
              groups: r.groups.map((g) =>
                g.id === groupId
                  ? {
                      ...g,
                      pertanyaans: g.pertanyaans.map((p) =>
                        p.id === pertanyaanId ? { ...p, [field]: value } : p
                      ),
                    }
                  : g
              ),
            }
          : r
      )
    );
  };

  // Update opsi field (local state)
  const updateOpsiField = (
    groupId: string,
    pertanyaanId: string,
    opsiId: string,
    field: "text" | "nilai",
    value: string | number
  ) => {
    setRubrikList(
      rubrikList.map((r) =>
        r.id === selectedRubrikId
          ? {
              ...r,
              groups: r.groups.map((g) =>
                g.id === groupId
                  ? {
                      ...g,
                      pertanyaans: g.pertanyaans.map((p) =>
                        p.id === pertanyaanId
                          ? {
                              ...p,
                              opsiJawaban: p.opsiJawaban.map((o) =>
                                o.id === opsiId ? { ...o, [field]: value } : o
                              ),
                            }
                          : p
                      ),
                    }
                  : g
              ),
            }
          : r
      )
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-3 sm:p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-4 sm:mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            Rubrik Penilaian
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            Rancang pertanyaan, opsi jawaban (dropdown) beserta nilai & bobot
            untuk perhitungan nilai akhir.
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 sm:p-4 bg-red-50 border border-red-200 rounded text-sm sm:text-base text-red-700">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
          {/* Sidebar - Daftar Rubrik */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4">
              {/* Header, Checkbox Tampilkan Arsip, Refresh */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 mb-3 sm:mb-4">
                <h2 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4">
                  Rubrik
                </h2>
                {/* <input
                  type="checkbox"
                  id="showArsip"
                  checked={showArsipOnly}
                  onChange={(e) => setShowArsipOnly(e.target.checked)}
                  className="w-4 h-4"
                />
                <label htmlFor="showArsip" className="text-sm text-gray-700">
                  Tampilkan Arsip
                </label> */}
                <button
                  onClick={loadRubrikList}
                  className="sm:ml-auto text-blue-600 hover:text-blue-700 text-md font-medium flex items-center gap-1 cursor-pointer"
                >
                  <RefreshCw className="w-5 h-4" />
                  Refresh
                </button>
              </div>

              {/* Input Tambah Rubrik */}
              <div className="space-y-2 mb-3 sm:mb-4">
                <input
                  type="text"
                  placeholder="Nama rubrik baru"
                  value={newRubrikName}
                  onChange={(e) => setNewRubrikName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
                <select
                  value={newRubrikType}
                  onChange={(e) =>
                    setNewRubrikType(e.target.value as "SID" | "SEM")
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                >
                  <option value="SID">Sidang</option>
                  <option value="SEM">Seminar</option>
                </select>
                <button
                  onClick={handleAddRubrik}
                  disabled={saving}
                  className="w-full px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm font-medium disabled:opacity-50"
                >
                  {saving ? "Menambah..." : "Tambah"}
                </button>
              </div>

              {/* Daftar Rubrik */}
              {loading ? (
                <div className="text-center py-6 sm:py-8">
                  <Loader2 className="w-6 h-6 animate-spin mx-auto text-blue-500" />
                  <p className="text-sm text-gray-500 mt-2">Memuat...</p>
                </div>
              ) : rubrikList.length === 0 ? (
                <div className="text-center py-6 sm:py-8 border-2 border-dashed border-gray-300 rounded">
                  <p className="text-gray-500 mb-2 sm:mb-3 text-sm">
                    Belum ada rubrik
                  </p>
                  <p className="text-xs text-gray-400">
                    Buat rubrik baru di atas untuk memulai
                  </p>
                </div>
              ) : (
                <div className="space-y-2 max-h-[60vh] overflow-y-auto">
                  {rubrikList.map((rubrik) => (
                    <div
                      key={rubrik.id}
                      className={`border rounded-lg p-2 sm:p-3 cursor-pointer transition-colors ${
                        selectedRubrikId === rubrik.id
                          ? "bg-blue-100 border-blue-300"
                          : "bg-white border-gray-200 hover:bg-gray-50"
                      }`}
                      onClick={() => setSelectedRubrikId(rubrik.id)}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-2">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 text-xs sm:text-sm break-words">
                            {rubrik.nama}
                          </h3>
                          <p className="text-xs text-gray-500 mt-1">
                            {rubrik.groups.length} group
                            {rubrik.groups.length !== 1 ? "s" : ""}
                          </p>
                        </div>
                        <div className="flex gap-1 flex-shrink-0">
                          {rubrik.type === "SID" && (
                            <span className="px-2 py-0.5 bg-red-500 text-white text-xs rounded font-semibold">
                              SID
                            </span>
                          )}
                          {rubrik.type === "SEM" && (
                            <span className="px-2 py-0.5 bg-purple-500 text-white text-xs rounded font-semibold">
                              SEM
                            </span>
                          )}
                        </div>
                      </div>

                      {rubrik.isDefault && (
                        <div className="text-xs text-green-600 font-semibold mb-2">
                          ✓ Default
                        </div>
                      )}

                      <div className="border-t border-dashed border-gray-300 pt-2 mt-2">
                        <div className="flex flex-wrap gap-1 sm:gap-2 mb-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDuplicateRubrik(rubrik.id);
                            }}
                            className="text-xs px-2 sm:px-3 py-1 rounded cursor-pointer font-medium transition-all bg-blue-100 text-blue-700 hover:bg-blue-200 whitespace-nowrap"
                          >
                            Duplicate
                          </button>
                          {rubrik.type === "SEM" ? (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSetDefault(rubrik.id, "SEM");
                              }}
                              className={`text-xs px-2 sm:px-3 py-1 rounded cursor-pointer font-medium transition-all whitespace-nowrap ${
                                rubrik.type === "SEM" && rubrik.isDefault
                                  ? "bg-green-500 text-white hover:bg-green-600"
                                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                              }`}
                            >
                              <span className="hidden sm:inline">
                                Set Default Seminar
                              </span>
                              <span className="sm:hidden">Sem</span>
                            </button>
                          ) : (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSetDefault(rubrik.id, "SID");
                              }}
                              className={`text-xs px-2 sm:px-3 py-1 rounded cursor-pointer font-medium transition-all whitespace-nowrap ${
                                rubrik.type === "SID" && rubrik.isDefault
                                  ? "bg-green-500 text-white hover:bg-green-600"
                                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                              }`}
                            >
                              <span className="hidden sm:inline">
                                Set Default Sidang
                              </span>
                              <span className="sm:hidden">Sid</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Main Content - Edit Rubrik */}
          <div className="lg:col-span-9">
            {selectedRubrik ? (
              <div className="space-y-4 sm:space-y-6">
                {/* Edit Rubrik Section */}
                <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 mb-4 sm:mb-6">
                    <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                      Edit Rubrik
                    </h2>
                    <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                      <button
                        onClick={handleSaveRubrik}
                        disabled={saving}
                        className="flex-1 sm:flex-none px-3 sm:px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 font-medium flex items-center justify-center gap-2 disabled:opacity-50 text-sm sm:text-base"
                      >
                        {saving ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Save className="w-4 h-4" />
                        )}
                        Simpan
                      </button>
                      <button
                        onClick={() => handleDeleteRubrik(selectedRubrik.id)}
                        className="flex-1 sm:flex-none px-3 sm:px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 font-medium text-sm sm:text-base"
                      >
                        Hapus
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3 sm:space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Nama
                      </label>
                      <input
                        type="text"
                        value={selectedRubrik.nama}
                        onChange={(e) =>
                          updateRubrikField("nama", e.target.value)
                        }
                        className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Deskripsi
                      </label>
                      <textarea
                        value={selectedRubrik.deskripsi || ""}
                        onChange={(e) =>
                          updateRubrikField("deskripsi", e.target.value)
                        }
                        rows={4}
                        className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Struktur Section */}
                <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 mb-4 sm:mb-6">
                    <h2 className="text-base sm:text-xl font-bold text-gray-900">
                      Struktur ({selectedRubrik.groups.length} Group
                      {selectedRubrik.groups.length !== 1 ? "s" : ""})
                    </h2>
                    <button
                      onClick={handleAddGroup}
                      disabled={saving}
                      className="flex-1 sm:flex-none px-3 sm:px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium flex items-center justify-center gap-2 disabled:opacity-50 text-sm sm:text-base"
                    >
                      <Plus className="w-4 h-4" />
                      Tambah Group
                    </button>
                  </div>

                  {/* Groups */}
                  {selectedRubrik.groups.length === 0 ? (
                    <div className="text-center py-6 sm:py-8 border-2 border-dashed border-gray-300 rounded">
                      <p className="text-gray-500 mb-3 sm:mb-4 text-sm">
                        Belum ada group
                      </p>
                      <button
                        onClick={handleAddGroup}
                        disabled={saving}
                        className="px-3 sm:px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium inline-flex items-center gap-2 disabled:opacity-50 text-sm"
                      >
                        <Plus className="w-4 h-4" />
                        Buat Group Pertama
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4 sm:space-y-6">
                      {selectedRubrik.groups.map((group, groupIndex) => (
                        <div
                          key={group.id}
                          className="border border-gray-300 rounded-lg p-2 sm:p-4 overflow-x-auto"
                        >
                          {/* Group Header */}
                          <div className="bg-gray-50 -m-2 sm:-m-4 p-2 sm:p-4 rounded-t-lg mb-3 sm:mb-4">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 flex-1 min-w-0">
                                <label className="text-xs sm:text-sm font-semibold text-gray-700 whitespace-nowrap">
                                  NAMA GROUP
                                </label>
                                <input
                                  type="text"
                                  value={group.nama}
                                  onChange={(e) =>
                                    handleUpdateGroup(
                                      group.id,
                                      "nama",
                                      e.target.value
                                    )
                                  }
                                  className="flex-1 min-w-0 px-2 sm:px-3 py-1 sm:py-2 border border-gray-300 rounded text-xs sm:text-sm"
                                />
                              </div>
                              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
                                <label className="text-xs sm:text-sm font-semibold text-gray-700 whitespace-nowrap">
                                  BOBOT
                                </label>
                                <input
                                  type="number"
                                  step={0.1}
                                  value={
                                    group.bobotTotal === 0
                                      ? ""
                                      : group.bobotTotal
                                  }
                                  onChange={(e) => {
                                    const val = e.target.value.replace(
                                      /[^0-9.]/g,
                                      ""
                                    );
                                    handleUpdateGroup(
                                      group.id,
                                      "bobotTotal",
                                      val === ""
                                        ? 0
                                        : isNaN(parseFloat(val))
                                        ? 0
                                        : parseFloat(val)
                                    );
                                  }}
                                  className="w-16 px-2 sm:px-3 py-1 sm:py-2 border border-gray-300 rounded text-xs sm:text-sm text-center"
                                />
                                <div className="flex gap-0.5 sm:gap-1">
                                  <button
                                    onClick={() =>
                                      handleReorderGroup(group.id, "up")
                                    }
                                    className="p-1 sm:p-2 text-gray-600 hover:bg-gray-200 rounded"
                                    title="Naik"
                                  >
                                    <ChevronUp className="w-3 h-3 sm:w-4 sm:h-4" />
                                  </button>
                                  <button
                                    onClick={() =>
                                      handleReorderGroup(group.id, "down")
                                    }
                                    className="p-1 sm:p-2 text-gray-600 hover:bg-gray-200 rounded"
                                    title="Turun"
                                  >
                                    <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4" />
                                  </button>
                                  <button
                                    onClick={() =>
                                      handleAddPertanyaan(group.id)
                                    }
                                    className="p-1 sm:p-2 text-gray-600 hover:bg-gray-200 rounded"
                                    title="Tambah Pertanyaan"
                                  >
                                    <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteGroup(group.id)}
                                    className="p-1 sm:p-2 text-red-600 hover:bg-red-50 rounded"
                                    title="Hapus"
                                  >
                                    <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Pertanyaans */}
                          <div className="space-y-3 sm:space-y-4">
                            {group.pertanyaans.map((pertanyaan, pIndex) => (
                              <div
                                key={pertanyaan.id}
                                className="border border-gray-200 rounded-lg p-2 sm:p-4 bg-gray-50 overflow-x-auto"
                              >
                                <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mb-2 sm:mb-3">
                                  <textarea
                                    value={pertanyaan.text}
                                    onChange={(e) =>
                                      updatePertanyaanField(
                                        group.id,
                                        pertanyaan.id,
                                        "text",
                                        e.target.value
                                      )
                                    }
                                    onBlur={(e) =>
                                      handleUpdatePertanyaan(
                                        pertanyaan.id,
                                        "text",
                                        e.target.value
                                      )
                                    }
                                    rows={3}
                                    className="flex-1 px-2 sm:px-3 py-1 sm:py-2 border border-gray-300 rounded text-xs sm:text-sm"
                                    placeholder="Isi pertanyaan..."
                                  />
                                  <div className="flex flex-col gap-1 sm:gap-2">
                                    <div>
                                      <label className="block text-xs text-gray-600 mb-1">
                                        Bobot
                                      </label>
                                      <input
                                        type="number"
                                        step={0.1}
                                        value={
                                          pertanyaan.bobot === 0
                                            ? ""
                                            : pertanyaan.bobot
                                        }
                                        onChange={(e) => {
                                          const val = e.target.value.replace(
                                            /[^0-9.]/g,
                                            ""
                                          );
                                          updatePertanyaanField(
                                            group.id,
                                            pertanyaan.id,
                                            "bobot",
                                            val === ""
                                              ? 0
                                              : isNaN(parseFloat(val))
                                              ? 0
                                              : parseFloat(val)
                                          );
                                        }}
                                        onBlur={(e) => {
                                          const val = e.target.value.replace(
                                            /[^0-9.]/g,
                                            ""
                                          );
                                          handleUpdatePertanyaan(
                                            pertanyaan.id,
                                            "bobot",
                                            val === ""
                                              ? 0
                                              : isNaN(parseFloat(val))
                                              ? 0
                                              : parseFloat(val)
                                          );
                                        }}
                                        className="w-14 sm:w-16 px-2 py-1 border border-gray-300 rounded text-xs sm:text-sm text-center"
                                      />
                                    </div>
                                    <div>
                                      <label className="block text-xs text-gray-600 mb-1">
                                        Group
                                      </label>
                                      <select
                                        value={pertanyaan.groupId}
                                        onChange={(e) => {
                                          updatePertanyaanField(
                                            group.id,
                                            pertanyaan.id,
                                            "groupId",
                                            e.target.value
                                          );
                                          handleUpdatePertanyaan(
                                            pertanyaan.id,
                                            "groupId",
                                            e.target.value
                                          );
                                        }}
                                        className="w-28 sm:w-32 px-2 py-1 border border-gray-300 rounded text-xs sm:text-sm"
                                      >
                                        {selectedRubrik.groups.map((g) => (
                                          <option key={g.id} value={g.id}>
                                            {g.nama.substring(0, 10)}...
                                          </option>
                                        ))}
                                      </select>
                                    </div>
                                  </div>
                                </div>

                                <div className="flex flex-wrap gap-1 mb-2 sm:mb-3">
                                  <button
                                    onClick={() =>
                                      handleReorderPertanyaan(
                                        group.id,
                                        pertanyaan.id,
                                        "up"
                                      )
                                    }
                                    className="p-1 text-gray-600 hover:bg-gray-200 rounded"
                                    title="Naik"
                                  >
                                    <ChevronUp className="w-3 h-3 sm:w-4 sm:h-4" />
                                  </button>
                                  <button
                                    onClick={() =>
                                      handleReorderPertanyaan(
                                        group.id,
                                        pertanyaan.id,
                                        "down"
                                      )
                                    }
                                    className="p-1 text-gray-600 hover:bg-gray-200 rounded"
                                    title="Turun"
                                  >
                                    <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4" />
                                  </button>
                                  <button
                                    onClick={() =>
                                      handleDuplicatePertanyaan(pertanyaan.id)
                                    }
                                    className="px-2 sm:px-3 py-1 bg-gray-200 text-gray-700 rounded text-xs hover:bg-gray-300"
                                  >
                                    Duplikat
                                  </button>
                                  <button
                                    onClick={() =>
                                      handleDeletePertanyaan(pertanyaan.id)
                                    }
                                    className="px-2 sm:px-3 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700"
                                  >
                                    Hapus
                                  </button>
                                  <button
                                    onClick={() => handleAddOpsi(pertanyaan.id)}
                                    className="px-2 sm:px-3 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700"
                                  >
                                    + Opsi
                                  </button>
                                </div>

                                {/* Opsi Jawaban */}
                                <div>
                                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                                    <h4 className="text-xs sm:text-sm font-semibold text-gray-700">
                                      Opsi Jawaban
                                    </h4>
                                    <button
                                      onClick={() =>
                                        handleDeleteSelectedOpsi(pertanyaan.id)
                                      }
                                      className="px-2 sm:px-3 py-1 bg-red-100 text-red-700 rounded text-xs hover:bg-red-200 whitespace-nowrap"
                                    >
                                      Hapus Terpilih
                                    </button>
                                  </div>
                                  <div className="space-y-1 sm:space-y-2">
                                    {pertanyaan.opsiJawaban.map((opsi) => (
                                      <div
                                        key={opsi.id}
                                        className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 bg-white p-1 sm:p-2 rounded border border-gray-200 text-xs sm:text-sm"
                                      >
                                        <input
                                          type="checkbox"
                                          checked={opsi.selected}
                                          onChange={() =>
                                            toggleOpsiSelection(
                                              group.id,
                                              pertanyaan.id,
                                              opsi.id
                                            )
                                          }
                                          className="w-4 h-4 flex-shrink-0"
                                        />
                                        <input
                                          type="text"
                                          value={opsi.text}
                                          onChange={(e) =>
                                            updateOpsiField(
                                              group.id,
                                              pertanyaan.id,
                                              opsi.id,
                                              "text",
                                              e.target.value
                                            )
                                          }
                                          onBlur={(e) =>
                                            handleUpdateOpsi(
                                              opsi.id,
                                              "text",
                                              e.target.value
                                            )
                                          }
                                          placeholder="Text opsi"
                                          className="flex-1 min-w-0 px-2 py-0.5 sm:py-1 border border-gray-300 rounded"
                                        />
                                        <input
                                          type="number"
                                          step={0.1}
                                          value={
                                            opsi.nilai === 0 ? "" : opsi.nilai
                                          }
                                          onChange={(e) => {
                                            const val = e.target.value.replace(
                                              /[^0-9.]/g,
                                              ""
                                            );
                                            updateOpsiField(
                                              group.id,
                                              pertanyaan.id,
                                              opsi.id,
                                              "nilai",
                                              val === ""
                                                ? 0
                                                : isNaN(parseFloat(val))
                                                ? 0
                                                : parseFloat(val)
                                            );
                                          }}
                                          onBlur={(e) => {
                                            const val = e.target.value.replace(
                                              /[^0-9.]/g,
                                              ""
                                            );
                                            handleUpdateOpsi(
                                              opsi.id,
                                              "nilai",
                                              val === ""
                                                ? 0
                                                : isNaN(parseFloat(val))
                                                ? 0
                                                : parseFloat(val)
                                            );
                                          }}
                                          className="w-12 sm:w-16 px-2 py-0.5 sm:py-1 border border-gray-300 rounded text-center flex-shrink-0"
                                        />
                                        <button
                                          onClick={() =>
                                            handleDeleteOpsi(opsi.id)
                                          }
                                          className="p-0.5 sm:p-1 text-red-600 hover:bg-red-50 rounded flex-shrink-0"
                                        >
                                          <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                                        </button>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Add Pertanyaan Button */}
                          <button
                            onClick={() => handleAddPertanyaan(group.id)}
                            className="mt-3 sm:mt-4 w-full px-3 sm:px-4 py-2 border-2 border-dashed border-gray-300 text-gray-600 rounded hover:border-blue-500 hover:text-blue-600 font-medium text-sm"
                          >
                            + Tambah Pertanyaan
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Preview Perhitungan */}
                <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-6">
                  <h2 className="text-base sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">
                    Preview Perhitungan (Skema Group)
                  </h2>
                  <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">
                    Rumus final: sum( GroupScore * GroupWeight ) /
                    sum(GroupWeight). GroupScore = sum(q_value *
                    q_weight)/sum(q_weight) dalam group.
                  </p>

                  <div className="space-y-4 sm:space-y-6 overflow-x-auto">
                    {selectedRubrik.groups.map((group) => (
                      <div key={group.id} className="min-w-full">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2 sm:mb-3 pb-2 border-b-2 border-gray-300">
                          <h3 className="text-base sm:text-lg font-bold text-gray-900">
                            {group.nama}
                          </h3>
                          <span className="text-xs sm:text-sm font-semibold text-gray-700 whitespace-nowrap">
                            Bobot Group: {group.bobotTotal}
                          </span>
                        </div>
                        <div className="text-xs sm:text-sm text-gray-600">
                          <p className="mb-1">
                            Total bobot pertanyaan:{" "}
                            {group.pertanyaans.reduce(
                              (sum, p) => sum + p.bobot,
                              0
                            )}
                          </p>
                          {group.pertanyaans.map((p, idx) => (
                            <div key={p.id} className="ml-3 sm:ml-4 mb-2">
                              <p className="font-medium break-words">
                                {p.text}
                              </p>
                              <p className="text-xs text-gray-500">
                                w={p.bobot} |{" "}
                                {p.opsiJawaban
                                  .map((o) => `${o.text}(${o.nilai})`)
                                  .join(", ")}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Rentang Nilai Huruf */}
                <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-6">
                  <h2 className="text-base sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">
                    Rentang Nilai Huruf
                  </h2>
                  <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">
                    Atur minimum skor untuk setiap nilai huruf. Sistem memilih
                    huruf pertama dengan min_score &lt;= skor akhir.
                  </p>

                  <div className="space-y-2 sm:space-y-3 overflow-x-auto">
                    {rentangNilai.map((rentang, index) => (
                      <div
                        key={rentang.id}
                        className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 min-w-max sm:min-w-full"
                      >
                        <input
                          type="text"
                          value={rentang.grade}
                          onChange={(e) => {
                            const newRentang = [...rentangNilai];
                            newRentang[index] = {
                              ...newRentang[index],
                              grade: e.target.value,
                            };
                            setRentangNilai(newRentang);
                          }}
                          className="w-16 sm:w-20 px-2 sm:px-3 py-1 sm:py-2 border border-gray-300 rounded text-xs sm:text-base"
                          placeholder="Grade"
                        />

                        <input
                          type="number"
                          step={0.1}
                          value={
                            rentang.minScore === 0 &&
                            rentang.id.startsWith("temp-")
                              ? ""
                              : rentang.minScore
                          }
                          onChange={(e) => {
                            const newRentang = [...rentangNilai];
                            const val = e.target.value;

                            // Allow decimal numbers like 72.5
                            const numVal = val === "" ? 0 : parseFloat(val);
                            newRentang[index] = {
                              ...newRentang[index],
                              minScore: isNaN(numVal) ? 0 : numVal,
                            };
                            setRentangNilai(newRentang);
                          }}
                          className="w-20 sm:w-24 px-2 sm:px-3 py-1 sm:py-2 border border-gray-300 rounded text-xs sm:text-base"
                          placeholder="Min Score"
                        />
                        <button
                          onClick={() => handleDeleteRentang(rentang.id)}
                          disabled={saving}
                          className="px-3 sm:px-4 py-1 sm:py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 text-xs sm:text-sm whitespace-nowrap"
                        >
                          Hapus
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2 mt-3 sm:mt-4">
                    <button
                      onClick={handleAddRentang}
                      className="flex-1 sm:flex-none px-3 sm:px-4 py-2 border-2 border-blue-600 text-blue-600 rounded hover:bg-blue-50 flex items-center justify-center gap-2 text-sm font-medium"
                    >
                      <Plus className="w-4 h-4" />
                      Rentang
                    </button>
                    <button
                      onClick={handleSaveRentangNilai}
                      disabled={saving}
                      className="flex-1 sm:flex-none px-3 sm:px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 flex items-center justify-center gap-2 disabled:opacity-50 text-sm"
                    >
                      {saving ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Save className="w-4 h-4" />
                      )}
                      Simpan Rentang
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg border border-gray-200 p-6 sm:p-12 text-center">
                <p className="text-sm sm:text-base text-gray-500">
                  Pilih rubrik untuk mengedit
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RubrikPage;
