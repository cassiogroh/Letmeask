import copyImg from '../assets/images/copy.svg';

import '../styles/room-code.scss';

interface RoomCodeProps {
  code: string;
}

export function RoomCode({ code }: RoomCodeProps) {
  function copyRoomCodeToClipboard() {
    navigator.clipboard.writeText(code);

    alert('Código da sala copiado para o Clipboard')
  }

  return (
    <button className='room-code' onClick={copyRoomCodeToClipboard} title='Copiar código da sala'>
      <div>
        <img
          src={copyImg}
          alt='Copiar código da sala'
        />
      </div>
      <span>Sala #{code}</span>
    </button>
  )
}
