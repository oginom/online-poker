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
  tips: number;
  betSize: number;
  participation: boolean;

  pocket0: Card;
  pocket1: Card;
}

type Phase = "PreFlop" | "Flop" | "Turn" | "River";

type PhaseAction = Phase;
type PlayerActionType = "Fold" | "Check" | "Call" | "Raise";
type PlayerAction = {
  player: number;
  type: PlayerActionType;
  amount: number;
}

type Action = PhaseAction | PlayerAction;

type Game = {
  phase: Phase;
  turn: number;
  button: number;
  potSize: number;

  field: Field;
  players: Player[];

  actions: Action[];
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

const Field: React.FC<{ phase: Phase, field: Field } & GroupProps> = (props) => {
  const show0 = ["Flop", "Turn", "River"].includes(props.phase);
  const show1 = show0;
  const show2 = show0;
  const show3 = ["Turn", "River"].includes(props.phase);
  const show4 = ["River"].includes(props.phase);


  return <group {...props}>
    {show0 && <Trump position={[-2.4, 0, 0]} card={props.field.card0} />}
    {show1 && <Trump position={[-1.2, 0, 0]} card={props.field.card1} />}
    {show2 && <Trump position={[0, 0, 0]} card={props.field.card2} />}
    {show3 && <Trump position={[1.2, 0, 0]} card={props.field.card3} />}
    {show4 && <Trump position={[2.4, 0, 0]} card={props.field.card4} />}
  </group>
}

const PlayerHand: React.FC<{ player: Player, isTurn: boolean } & GroupProps> = (props) => {
  return <group {...props}>
    {props.isTurn && <Text position={[-1.0, -1.0, 0.1]} fontSize={0.3} color={'#000'}>TURN</Text>}
    <Trump position={[-0.4, 0, 0]} card={props.player.pocket0} />
    <Trump position={[0.4, 0, 0]} card={props.player.pocket1} />
    <Text position={[0, -1.0, 0.1]} fontSize={0.3} color={'#000'}>{props.player.name}</Text>
    <Text position={[0, -1.5, 0.1]} fontSize={0.3} color={'#000'}>{props.player.tips}</Text>
    <Text position={[0, 1.0, 0.1]} fontSize={0.3} color={'#000'}>{props.player.betSize}</Text>
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

const initialGame: Game = {
  field: {
    card0: {number: 5, suit: "Spade"},
    card1: {number: 6, suit: "Spade"},
    card2: {number: 7, suit: "Spade"},
    card3: {number: 8, suit: "Spade"},
    card4: {number: 9, suit: "Spade"},
  },
  phase: "River",
  button: 3,
  turn: 3,
  potSize: 80,
  players: [
    {
      name: "player1",
      pocket0: {number: 1, suit: "Spade"},
      pocket1: {number: 13, suit: "Spade"},
      tips: 180,
      betSize: 5,
      participation: true,
    },
    {
      name: "player2",
      pocket0: {number: 2, suit: "Spade"},
      pocket1: {number: 13, suit: "Spade"},
      tips: 180,
      betSize: 0,
      participation: false,
    },
    {
      name: "player3",
      pocket0: {number: 3, suit: "Spade"},
      pocket1: {number: 13, suit: "Spade"},
      tips: 180,
      betSize: 10,
      participation: true,
    },
    {
      name: "player4",
      pocket0: {number: 4, suit: "Spade"},
      pocket1: {number: 13, suit: "Spade"},
      tips: 180,
      betSize: 0,
      participation: true,
    },
  ],
  actions: [
    "PreFlop",
    {
      player: 0,
      type: "Raise",
      amount: 5,
    },
    {
      player: 1,
      type: "Fold",
      amount: 0,
    },
    {
      player: 2,
      type: "Raise",
      amount: 10,
    },
  ]
}

const Home: NextPage = () => {
  const L = -3;
  const R = 3;
  const T = 2;
  const B = -2;

  const [game, setGame] = useState<Game>(initialGame);

  const [nextAction, setNextAction] = useState<PlayerAction>({
    player: 0,
    type: "Fold",
    amount: 0,
  });

  const submitAction = (e: React.FormEvent) => {
    e.preventDefault();
    const playerNextAction = {
      ...nextAction,
      player: game.turn,
    };
    let newPlayers = game.players;
    const currentBetSize = Math.max(...game.players.map(player => player.betSize));
    if (nextAction.type === "Fold") {
      playerNextAction.amount = 0;
      newPlayers = game.players.map((player, i) => {
        if (i === game.turn) {
          return {
            ...player,
            participation: false,
          };
        }
        return player;
      });
    } else if (nextAction.type === "Call") {
      playerNextAction.amount = currentBetSize - game.players[game.turn].betSize;
      newPlayers = game.players.map((player, i) => {
        if (i === game.turn) {
          return {
            ...player,
            tips: player.tips - playerNextAction.amount,
            betSize: currentBetSize,
          };
        }
        return player;
      });
    } else if (nextAction.type === "Raise") {
      newPlayers = game.players.map((player, i) => {
        if (i === game.turn) {
          return {
            ...player,
            tips: player.tips - playerNextAction.amount,
            betSize: player.betSize + playerNextAction.amount,
          };
        }
        return player;
      });
    } else if (nextAction.type === "Check") {
      playerNextAction.amount = 0;
    }
    setGame({
      ...game,
      players: newPlayers,
      actions: [...game.actions, playerNextAction],
      turn: (game.turn + 1) % game.players.length,
    });
  }

  return <><div style={{ width: '99vw', height: '66vw' }}>
    <Canvas flat>
      <OrthographicCamera makeDefault position={[0, 0, 0]} left={L} right={R} top={T} bottom={B} near={0.1} far={1000} >
        <ambientLight />
        <pointLight position={[10, 10, 10]} />
        <Rig />
        <Field phase={game.phase} field={game.field} position={[0, 0, -2]} scale={0.5}/>
        <PlayerHand player={game.players[0]} isTurn={game.turn === 0} position={[0, -1.3, -2]} scale={0.5}/>
        <PlayerHand player={game.players[1]} isTurn={game.turn === 1} position={[-2.5,0, -2]} scale={0.5}/>
        <PlayerHand player={game.players[2]} isTurn={game.turn === 2} position={[0, 1.3, -2]} scale={0.5}/>
        <PlayerHand player={game.players[3]} isTurn={game.turn === 3} position={[2.5, 0, -2]} scale={0.5}/>
      </OrthographicCamera>
    </Canvas>
  </div>
  <form>
    <label>
      Action:
      <select value={nextAction.type} onChange={(e) => setNextAction({...nextAction, type: e.target.value as "Fold" | "Check" | "Call" | "Raise"})}>
        <option value="Fold">Fold</option>
        <option value="Check">Check</option>
        <option value="Call">Call</option>
        <option value="Raise">Raise</option>
      </select>
    </label>
    <label>
      Amount:
      <input type="number" value={nextAction.amount} onChange={(e) => setNextAction({...nextAction, amount: parseInt(e.target.value)})} />
    </label>
    <button onClick={submitAction}>Submit</button>
  </form>
  </>
};

export default Home;
