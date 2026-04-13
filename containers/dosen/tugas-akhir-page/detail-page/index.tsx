"use client";

import ContainerCardContent from "@/components/cards/ContainerCardContent";
import BlueButton from "@/components/buttons/BlueButton";
import RedButton from "@/components/buttons/RedButton";

interface TeamMember {
  name: string;
  nim: string;
}

interface StudentDetail {
  name: string;
  nim: string;
  title: string;
  topicSource: string;
  projectType: string;
  dispensationFile: string;
  draftFile: string;
  teamMembers: TeamMember[];
  updateResume: string;
}

const mockStudentDetail: StudentDetail = {
  name: "Ahmad Dwikky Zerro Dixxon",
  nim: "121140040",
  title: "Integrasi GATA dengan SIPETA dan Penjadwalan",
  topicSource: "Tawaran Dosen",
  projectType: "Capstone",
  dispensationFile: "Surat dispen.pdf",
  draftFile: "Draft TA.pdf",
  teamMembers: [
    { name: "Ahmad Dwikky Zerro Dixxon", nim: "121140040" },
    { name: "Ahmad Rizky Beluga", nim: "121140090" },
    { name: "Benedictus Budi", nim: "121140090" },
  ],
  updateResume:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
};

const DetailPage: React.FC<{}> = ({}) => {
  const handleDownload = (filename: string) => {
    // Mock download functionality
    `Downloading: ${filename}`;
    // In real implementation, this would trigger file download
  };

  const handleAccept = () => {
    ("Student accepted");
    // In real implementation, this would update the status
  };

  const handleReject = () => {
    ("Student rejected");
    // In real implementation, this would update the status
  };

  return (
    <div className="w-full flex justify-center">
      <div className="w-full max-w-2xl">
        <ContainerCardContent className="bg-gray-background rounded-lg shadow-md p-8">
          {/* Header */}
          <h1 className="text-2xl font-bold text-blue-600 mb-8 text-center">
            DETAIL MAHASISWA
          </h1>

          {/* Student Information */}
          <div className="grid grid-cols-[12rem_1rem_1fr] gap-4 text-left">
            <p>Nama</p>
            <div>:</div>
            <p>{mockStudentDetail.name}</p>
            <p>NIM</p>
            <div>:</div>
            <p>{mockStudentDetail.nim}</p>
            <p>Judul Tugas Akhir</p>
            <div>:</div>
            <p>{mockStudentDetail.title}</p>
            <p>Sumber Topik</p>
            <div>:</div>
            <p>{mockStudentDetail.topicSource}</p>
            <p>Tipe Tugas Akhir</p>
            <div>:</div>
            <p>{mockStudentDetail.projectType}</p>
            <p>Surat Dispen</p>
            <div>:</div>
            <p>
              {mockStudentDetail.dispensationFile}
              <a href="#" className="ms-4 text-primary">
                Download
              </a>
            </p>
            <p>Draft TA</p>
            <div>:</div>
            <p>
              {mockStudentDetail.draftFile}{" "}
              <a href="#" className="ms-4 text-primary">
                Download
              </a>
            </p>
            <p>Anggota Kelompok</p>
            <div>:</div>
            <div>
              {mockStudentDetail.teamMembers.map((member, index) => {
                return (
                  <p key={index}>
                    {member.name} - {member.nim}
                  </p>
                );
              })}
            </div>
          </div>

          {/* Update Resume */}
          <div>
            <div className="font-medium text-gray-700 mb-3">
              Resume Pembaharuan:
            </div>
            <div className="bg-secondary p-4 rounded-lg">
              <p className="text-gray-700 text-sm leading-relaxed">
                {mockStudentDetail.updateResume}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center gap-4 mt-8">
            <BlueButton
              url="#"
              props={{ onClick: handleAccept }}
              className="px-8 py-3 text-base font-medium"
            >
              Terima
            </BlueButton>
            <RedButton
              url="#"
              props={{ onClick: handleReject }}
              className="px-8 py-3 text-base font-medium"
            >
              Tolak
            </RedButton>
          </div>
        </ContainerCardContent>
      </div>
    </div>
  );
};

export default DetailPage;
