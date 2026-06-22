import React, { useState } from 'react';
import PhuKienModal from './PhuKienModal';

const DanhSachPhuKien = ({ phuKienDaChon, setPhuKienDaChon }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div className="w-full h-full border border-gray-200 rounded bg-white p-3 text-sm flex flex-col relative">
            <div className="flex justify-between items-center border-b border-gray-200 pb-2 mb-2 font-semibold text-gray-600">
                <div className="flex gap-4">
                    <span className="w-8 text-center">S.L</span>
                    <span>Phụ kiện <span className="bg-[#00a8ff] text-white rounded-full px-1.5 text-xs">{phuKienDaChon.length}</span></span>
                </div>

                {/* Nút Sở hữu v= mở Modal */}
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="text-blue-500 hover:text-blue-700 font-medium flex items-center gap-1"
                >
                    Sở hữu <span className="text-lg leading-none">✓=</span>
                </button>
            </div>

            <div className="flex-1 overflow-y-auto">
                {phuKienDaChon.map((pk, idx) => (
                    <div key={idx} className="flex justify-between items-center mb-2">
                        <div className="flex gap-4 items-center">
                            <span className="w-8 text-center text-gray-700 font-medium">{pk.soLuong}</span>
                            <span className="text-gray-800">{pk.tenPhuKien}</span>
                        </div>
                        <span className={`px-2 py-0.5 rounded text-[11px] font-medium text-white ${pk.soHuu === 'Nha khoa' ? 'bg-green-500' : 'bg-[#00a8ff]'}`}>
                            {pk.soHuu}
                        </span>
                    </div>
                ))}
            </div>

            {/* Gọi Modal Phụ Kiện */}
            <PhuKienModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                initialSelected={phuKienDaChon}
                onSave={(newList) => setPhuKienDaChon(newList)}
            />
        </div>
    );
};

export default DanhSachPhuKien;