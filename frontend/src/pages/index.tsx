import { NextPage } from 'next';
import React, { useRef, useState } from 'react';
import { Canvas, useFrame, MeshProps, GroupProps } from '@react-three/fiber';
import { Mesh, OrthographicCamera as OrthographicCamera_three, Vector3 } from 'three';
import { Text, OrthographicCamera } from '@react-three/drei';

// domain types

type Suit = "Spade" | "Heart" | "Diamond" | "Club";
type Card = {
  number: number;
  suit: Suit;
};

type Field = {
  card0: Card;
  card1: Card;
  card2: Card;
  card3: Card;
  card4: Card;
}

type Player = {
  name: string;
  pocket0: Card;
  pocket1: Card;
}

type Game = {
  field: Field;
  players: Player[];
}

// component types

type BoxProps = {
  position: [x: number, y: number, z: number];
};

type TrumpProps = {
  card: Card;
};

const Trump: React.FC<TrumpProps & MeshProps> = (props) => {
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
        position={[-0.3, 0.5, 0.05]}
        fontSize={0.1}
        color={'#000'}
      >
        {props.card.suit}
      </Text>
      <Text
        position={[0, 0, 0.05]}
        fontSize={0.6}
        color={'#000'}
      >
        {props.card.number}
      </Text>
    </mesh>
  );
}

const Field: React.FC<{ field: Field } & GroupProps> = (props) => {
  return <group {...props}>
    <Trump position={[-2.4, 0, 0]} card={props.field.card0} />
    <Trump position={[-1.2, 0, 0]} card={props.field.card1} />
    <Trump position={[0, 0, 0]} card={props.field.card2} />
    <Trump position={[1.2, 0, 0]} card={props.field.card3} />
    <Trump position={[2.4, 0, 0]} card={props.field.card4} />
  </group>
}

const PlayerHand: React.FC<{ player: Player } & GroupProps> = (props) => {
  return <group {...props}>
    <Trump position={[-0.4, 0, 0]} card={props.player.pocket0} />
    <Trump position={[0.4, 0, 0]} card={props.player.pocket1} />
    <Text position={[0, -1.0, 0.1]} fontSize={0.3} color={'#000'}>{props.player.name}</Text>
  </group>
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
    (state.camera as OrthographicCamera_three).top = 2;
    (state.camera as OrthographicCamera_three).bottom = -2;
    (state.camera as OrthographicCamera_three).left = -3;
    (state.camera as OrthographicCamera_three).right = 3;
  })
};

const Home: NextPage = () => {
  const L = -3;
  const R = 3;
  const T = 2;
  const B = -2;

  const game: Game = {
    field: {
      card0: {number: 5, suit: "Spade"},
      card1: {number: 6, suit: "Spade"},
      card2: {number: 7, suit: "Spade"},
      card3: {number: 8, suit: "Spade"},
      card4: {number: 9, suit: "Spade"},
    },
    players: [
      {
        name: "player1",
        pocket0: {number: 1, suit: "Spade"},
        pocket1: {number: 13, suit: "Spade"},
      },
      {
        name: "player2",
        pocket0: {number: 2, suit: "Spade"},
        pocket1: {number: 13, suit: "Spade"},
      },
      {
        name: "player3",
        pocket0: {number: 3, suit: "Spade"},
        pocket1: {number: 13, suit: "Spade"},
      },
      {
        name: "player4",
        pocket0: {number: 4, suit: "Spade"},
        pocket1: {number: 13, suit: "Spade"},
      },
    ]
  }

  return <div style={{ width: '99vw', height: '66vw' }}>
    <Canvas flat>
      <OrthographicCamera makeDefault position={[0, 0, 0]} left={L} right={R} top={T} bottom={B} near={0.1} far={1000} >
        <ambientLight />
        <pointLight position={[10, 10, 10]} />
        <Rig />
        <Field field={game.field} position={[0, 0, -2]} scale={0.5}/>
        <PlayerHand player={game.players[0]} position={[0, -1.3, -2]} scale={0.5}/>
        <PlayerHand player={game.players[1]} position={[-2.5,0, -2]} scale={0.5}/>
        <PlayerHand player={game.players[2]} position={[0, 1.3, -2]} scale={0.5}/>
        <PlayerHand player={game.players[3]} position={[2.5, 0, -2]} scale={0.5}/>
      </OrthographicCamera>
    </Canvas>
  </div>
};

export default Home;
