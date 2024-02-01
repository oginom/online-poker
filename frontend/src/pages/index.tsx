import { NextPage } from 'next';
import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Mesh, Vector3 } from 'three';
import { Text, OrthographicCamera } from '@react-three/drei';

type BoxProps = {
  position: [x: number, y: number, z: number];
};

type TrumpProps = {
  position: [x: number, y: number, z: number];
  number: number;
  suit: string;
};

const Trump: React.FC<TrumpProps> = (props) => {
  const mesh = useRef<Mesh>(null!);
  const [hovered, setHover] = useState(false);
  const [active, setActive] = useState(false);
  //useFrame(() => (mesh.current.rotation.x += 0.01));

  return (
    <mesh
      {...props}
      ref={mesh}
      scale={active ? 1.5 : 1}
      onClick={() => setActive(!active)}
    >
      <boxGeometry args={[1, 1.4, 0.1]} />
      <meshStandardMaterial color={'white'} />
      <Text
        position={[-0.3, 0.3, 0.05]}
        fontSize={0.1}
        color={'#000'}
      >
        {props.suit}
      </Text>
      <Text
        position={[0, 0, 0.05]}
        fontSize={0.2}
        color={'#000'}
      >
        {props.number}
      </Text>
    </mesh>
  );
}

const Box: React.FC<BoxProps> = (props) => {
  const mesh = useRef<Mesh>(null!);
  const [hovered, setHover] = useState(false);
  const [active, setActive] = useState(false);
  useFrame(() => (mesh.current.rotation.x += 0.01));

  return (
    <mesh
      {...props}
      ref={mesh}
      scale={active ? 1.5 : 1}
      onClick={() => setActive(!active)}
      onPointerOver={() => setHover(true)}
      onPointerOut={() => setHover(false)}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={hovered ? 'hotpink' : 'orange'} />
    </mesh>
  );
};

const Rig = ({ v = new Vector3() }) => {
  return useFrame((state) => {
    //state.camera.position.lerp(v.set(state.mouse.x / 2, state.mouse.y / 2, 10), 0.05)
    //state.camera.position.set(0, 0, 1);
  })
};

const Home: NextPage = () => {
  const L = -3;
  const R = 3;
  const T = 2;
  const B = -2+0;

  return <div style={{ width: '100vw', height: '100vh' }}>
    <Canvas>
      <OrthographicCamera makeDefault position={[0, 0, 1]} left={L} right={R} top={T} bottom={B} near={0.1} far={1000} />
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      <Rig />
      <Trump position={[-2.4, 0, 0]} number={5} suit={"Spade"} />
      <Trump position={[-1.2, 0, 0]} number={5} suit={"Spade"} />
      <Trump position={[0, 0, 0]} number={5} suit={"Spade"} />
      <Trump position={[1.2, 0, 0]} number={5} suit={"Spade"} />
      <Trump position={[2.4, 0, 0]} number={5} suit={"Spade"} />
    </Canvas>
  </div>
};

export default Home;
