import { useState } from "react";
import styled from "styled-components";
import Button from "../components/Common/Button";
import Modal from "../components/Common/Modal";
import InputField from "../components/Common/InputField";
import Drawer from "../components/Common/Drawer";

const SytledLayout = styled.div`
  margin: 0 auto;
`;

function CommonSamplePage(props) {

  const [modalOpen, setModalOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(true);

  const modalHandler = () => {
    setModalOpen(!modalOpen);
  };

  const drawerHandler = () => {
    setDrawerOpen(!drawerOpen);
  };

  return (
    <SytledLayout className="flex gap-x-6">
      <Drawer 
        open={drawerOpen}
        active={() => setDrawerOpen(!drawerOpen)}
      />
      <Modal 
        open={modalOpen}
        active={() => setModalOpen(!modalOpen)}
        width={500}
        height={400}
      />
      <div className="m-4 grid gap-10">
        {/* button */}
        <p className="text-lg font-semibold">Button</p>
        <div className="flex justify-start gap-4">
          <Button size="sm" color="" border="">Button</Button>
          <Button size="sm" color="red" border="">Button</Button>
          <Button size="sm" color="green" border="">Button</Button>
          <Button size="sm" color="yellow" border="">Button</Button>
          <Button size="sm" color="indigo" border="">Button</Button>
          <Button size="sm" color="violet" border="">Button</Button>
          <Button size="sm" color="gray" border="">Button</Button>
          <Button size="sm" color="" border="pill">Button</Button>
        </div>
        <div className="flex justify-start gap-4">
          <Button size="" color="" border="">Button</Button>
          <Button size="" color="red" border="">Button</Button>
          <Button size="" color="green" border="">Button</Button>
          <Button size="" color="yellow" border="">Button</Button>
          <Button size="" color="indigo" border="">Button</Button>
          <Button size="" color="violet" border="">Button</Button>
          <Button size="" color="gray" border="">Button</Button>
          <Button size="" color="" border="pill">Button</Button>
        </div>
        <div className="flex justify-start gap-4">
          <Button size="lg" color="" border="">Button</Button>
          <Button size="lg" color="red" border="">Button</Button>
          <Button size="lg" color="green" border="">Button</Button>
          <Button size="lg" color="yellow" border="">Button</Button>
          <Button size="lg" color="indigo" border="">Button</Button>
          <Button size="lg" color="violet" border="">Button</Button>
          <Button size="lg" color="gray" border="">Button</Button>
          <Button size="lg" color="" border="pill">Button</Button>
        </div>
        {/* input */}
        <p className="text-lg font-semibold">Text Field</p>
        <div className="flex justify-start gap-4">
          <InputField size="sm" border="" placeholder="Text"/>
          <InputField size="sm" border="pill" placeholder=""/>
        </div>
        <div className="flex justify-start gap-4">
          <InputField size="md" border="" placeholder="Text"/>
          <InputField size="md" border="pill" placeholder=""/>
        </div>
        <div className="flex justify-start gap-4">
          <InputField size="lg" border="" placeholder="Text"/>
          <InputField size="lg" border="pill" placeholder=""/>
        </div>
        {/* modal */}
        <p className="text-lg font-semibold">Modal</p>
        <div>
          <Button onClick={modalHandler}>Modal</Button>
        </div>
        <p className="text-lg font-semibold">Drawer Sidebar</p>
        <div>
          <Button onClick={drawerHandler}>Drawer</Button>
        </div>
      </div>
    </SytledLayout>
  );
}

export default CommonSamplePage;