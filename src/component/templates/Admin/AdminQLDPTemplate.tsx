import React, { useEffect, useState } from 'react';
import { Modal, Popover, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { RootState, useAppDispatch } from 'store';
import { useSelector } from 'react-redux';
import { DatPhong } from 'type';
import { Button } from 'component';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify'
import { getDanhSachDatPhongThunk } from 'store/quanLyDatPhong';
import { quanLyDatPhongServices } from 'services';
import { quanLyNguoiDungActions } from 'store/quanLyNguoiDung';
import { handleError } from 'utils';


export const AdminQLNDPTemplate: React.FC = () => {

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [idDelete, setIdDelete] = useState(0)
  const [nameDelete, setNameDelete] = useState('')

  const navigate = useNavigate()

  const dispatch = useAppDispatch();

  const { danhSachDatPhong } = useSelector((state: RootState) => state.quanLyDatPhong)

  useEffect(() => {
    dispatch(getDanhSachDatPhongThunk())
  }, [dispatch])

  const data: DatPhong = danhSachDatPhong

  const columns: ColumnsType<DatPhong> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: '15%',
    },
    {
      title: 'Mã phòng',
      dataIndex: 'maPhong',
      key: 'maPhong',
      width: '15%',
    },
    {
      title: 'Ngày đến',
      dataIndex: 'ngayDen',
      key: 'ngayDen',
      width: '15%'
    },
    {
      title: 'Ngày đi',
      dataIndex: 'ngayDi',
      key: 'ngayDi',
      width: '15%'
    },
    {
      title: 'Mã người dùng',
      dataIndex: 'maNguoiDung',
      key: 'maNguoiDung',
      width: '15%'
    },
    {
      title: 'Action',
      dataIndex: '',
      key: 'x',
      render: (_, record) => (
        <div className='grid grid-cols-2 gap-10'>
          <Button
            className='btnSua'

          >Update</Button>

          <Button
            className='btnXoa'
            onClick={() => {
              setIdDelete(record.id)
              setNameDelete(record.maNguoiDung.toString())
              setIsModalOpen(true)
            }}
          >Delete</Button>

          <Modal
            title="Bạn muốn xóa Mã đặt phòng này ?"
            mask={false}
            open={isModalOpen}
            onOk={async () => {
              console.log('id: ', idDelete)
              try {
                await quanLyDatPhongServices.deleteDatPhong(idDelete.toString())
                setIsModalOpen(false)
                toast.success(`Xoá Mã đặt phòng ${idDelete} thành công`)
                setTimeout(() => location.reload(), 2000)
              } catch (err) {
                console.log("err: ", err);
                handleError(err)
              }
            }}
            onCancel={() => setIsModalOpen(false)}
          >
            <p>ID: {idDelete}</p>
            <p>Mã người dùng: {nameDelete}</p>
          </Modal>
        </div>
      ),
      width: '25%',
    },
  ];

  return (
    <Layout>

      <div className='mb-24 flex justify-between'>
        <Button
          className='btnThem'
          onClick={() => {
            dispatch(quanLyNguoiDungActions.logOut('abc'))
            toast.error('Bạn hãy chọn phòng muốn đặt')
            navigate('/')
          }}
        >+ Đặt phòng
        </Button>

        <Popover
          className='cursor-pointer border border-gray-400 py-4 px-4 rounded-full shadow shadow-blue-500/40 hover:shadow-indigo-400'
          content={<div className='p-4 w-[250px]'>
            {/* <p
              className='cursor-pointer font-600 text-16 px-8 py-8 rounded-10 hover:bg-gray-100'
              onClick={() => navigate(PATH.login)}
            >
              Đăng nhập
            </p> */}

            <p
              className='cursor-pointer text-[#e50914] font-600 text-16 px-8 py-8 rounded-10 hover:bg-gray-100'
              onClick={() => {
                dispatch(quanLyNguoiDungActions.logOut('abc'))
                navigate('/')
              }}
            >
              User Page & Log Out
              <i className='fa-solid fa-repeat ms-16'></i>
            </p>
          </div>}

          trigger={'click'}
          arrow={false}
        >
          <div className='grid grid-cols-2 w-[140px]'>
            <div className="text-center">
              <i className="fa-solid fa-bars pt-[24px]"></i>
            </div>
            <div>
              <img className='rounded-full w-[60px] h-[60px]' src='/public/images/admin2.png' alt="..." />
            </div>
          </div>
        </Popover>
      </div>

      <Table
        pagination={{ pageSize: 10 }}
        size='small'
        columns={columns}
        dataSource={data}
      />

    </Layout>
  )
};

const Layout = styled.div`
   .btnThem {
    background: #007bff;
    border: none;
    color: white;
    &:hover {
    background: #031657;
    color: white !important
    }
   }

   .btnSua {
    background: #28a475;
    border: none;
    color: white;
    &:hover {
    background: #02442b;
    color: white !important
    }
   }

   .btnXoa {
    background: #dc3545;
    border: none;
    color: white;
    &:hover {
    background: #7e020f;
    color: white !important
    }
   }
`



