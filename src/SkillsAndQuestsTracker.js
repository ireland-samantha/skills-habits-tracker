import React, { useState, useEffect } from 'react';
import { Button, Progress, Input, Modal, message, Upload, Form, Tooltip, Select } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, CheckOutlined, DownloadOutlined, UploadOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import confetti from 'canvas-confetti';
import { motion } from 'framer-motion';

const parchmentBackground = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cfilter id='noise' x='0' y='0'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.65' numOctaves='3' stitchTiles='stitch' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='.2' fill='%23e6d1ac'/%3E%3C/svg%3E";

const Container = styled.div`
  max-width: 100%;
  height: 100vh;
  margin: 0 auto;
  padding: 1rem;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: auto auto 1fr;
  gap: 1rem;
  background-image: url("${parchmentBackground}");
  background-color: #f3e8d2;
  font-family: 'Fondamento', cursive;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    grid-template-rows: auto auto 1fr 1fr;
  }
`;

const HeaderContainer = styled.div`
  grid-column: 1 / -1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem;
`;

const Header = styled.h1`
  font-family: 'MedievalSharp', cursive;
  text-align: center;
  color: #92400e;
  margin: 0;
  font-size: 2.5rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
`;

const HeaderButtons = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  background-color: rgba(255, 255, 255, 0.4);
  border-radius: 0.5rem;
  padding: 1rem;
  box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.1);
`;

const SectionContent = styled.div`
  flex-grow: 1;
  overflow-y: auto;
  padding-right: 0.5rem;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #555;
  }
`;

const SectionTitle = styled.h2`
  font-family: 'MedievalSharp', cursive;
  color: #92400e;
  margin-top: 0;
  font-size: 1.5rem;
  border-bottom: 2px solid #d97706;
  padding-bottom: 0.5rem;
`;

const Footer = styled.div`
  grid-column: 1 / -1;
  display: flex;
  justify-content: space-around;
`;

const StyledButton = styled(Button)`
  background-color: #f59e0b;
  border-color: #d97706;
  color: #fff;
  margin: 0 0.25rem;
  &:hover {
    background-color: #d97706;
    border-color: #92400e;
  }
`;

const AddButton = styled(Button)`
  background-color: #10B981;
  border-color: #059669;
  color: white;
  &:hover {
    background-color: #059669;
    border-color: #047857;
    color: white;
  }
`;

const CompleteButton = styled(Button)`
  background-color: #3B82F6;
  border-color: #2563EB;
  color: white;
  &:hover {
    background-color: #2563EB;
    border-color: #1D4ED8;
    color: white;
  }
  transition: all 0.3s ease;
  &:active {
    transform: scale(0.95);
  }
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const SkillCard = styled(motion.div)`
  background-color: rgba(254, 243, 199, 0.7);
  border-radius: 0.5rem;
  padding: 0.5rem;
  margin-bottom: 0.5rem;
  border: 1px solid #d97706;
  font-size: 0.9rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    transform: translateY(-2px);
  }

  display: flex;
  align-items: center;
`;

const ProgressWrapper = styled.div`
  flex: 1;
  margin-right: 1rem;

  @media (max-width: 768px) {
    width: 100%;
    margin-right: 0;
    margin-bottom: 0.5rem;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 0.25rem;

  @media (max-width: 768px) {
    width: 100%;
    justify-content: space-between;
  }
`;


const defaultSkills = [
  { id: '1', name: 'Strength', abbr: 'STR', exp: 0 },
  { id: '2', name: 'Stealth', abbr: 'STL', exp: 0 },
  { id: '3', name: 'Intellect', abbr: 'INT', exp: 0 },
  { id: '4', name: 'Alchemy', abbr: 'ALC', exp: 0 },
];

const defaultHabits = [
  { id: '1', name: 'Exercise for 30 minutes', expGains: [{ skillId: '1', exp: 50 }] },
  { id: '2', name: 'Read a book chapter', expGains: [{ skillId: '3', exp: 30 }] },
  { id: '3', name: 'Practice meditation', expGains: [{ skillId: '2', exp: 20 }, { skillId: '3', exp: 20 }] },
  { id: '4', name: 'Study a new topic', expGains: [{ skillId: '3', exp: 40 }, { skillId: '4', exp: 20 }] },
];

const SkillsAndHabitsTracker = () => {
  const [skills, setSkills] = useState(defaultSkills);
  const [habits, setHabits] = useState(defaultHabits);
  const [isSkillModalVisible, setIsSkillModalVisible] = useState(false);
  const [isHabitModalVisible, setIsHabitModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    const savedSkills = localStorage.getItem('skills');
    const savedHabits = localStorage.getItem('habits');
    if (savedSkills && savedHabits) {
      setSkills(JSON.parse(savedSkills));
      setHabits(JSON.parse(savedHabits));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('skills', JSON.stringify(skills));
    localStorage.setItem('habits', JSON.stringify(habits));
  }, [skills, habits]);

  const handleSkillSubmit = (values) => {
    if (editingItem) {
      setSkills(prevSkills => prevSkills.map(skill => 
        skill.id === editingItem.id ? { ...skill, ...values } : skill
      ));
    } else {
      setSkills(prevSkills => [...prevSkills, { id: Date.now().toString(), exp: 0, ...values }]);
    }
    setIsSkillModalVisible(false);
    setEditingItem(null);
    form.resetFields();
  };

  const handleHabitSubmit = (values) => {
    const habitData = {
      id: editingItem ? editingItem.id : Date.now().toString(),
      name: values.name,
      expGains: values.expGains.map(gain => ({
        skillId: gain.skillId,
        exp: parseInt(gain.exp)
      }))
    };

    if (editingItem) {
      setHabits(prevHabits => prevHabits.map(habit => 
        habit.id === editingItem.id ? habitData : habit
      ));
    } else {
      setHabits(prevHabits => [...prevHabits, habitData]);
    }
    setIsHabitModalVisible(false);
    setEditingItem(null);
    form.resetFields();
  };

  const deleteSkill = (id) => {
    setSkills(prevSkills => prevSkills.filter(skill => skill.id !== id));
    setHabits(prevHabits => prevHabits.map(habit => ({
      ...habit,
      expGains: habit.expGains.filter(gain => gain.skillId !== id)
    })));
  };

  const deleteHabit = (id) => {
    setHabits(prevHabits => prevHabits.filter(habit => habit.id !== id));
  };

  const completeHabit = (habit) => {
    let leveledUp = false;
    const updatedSkills = skills.map(skill => {
      const expGain = habit.expGains.find(gain => gain.skillId === skill.id);
      if (expGain) {
        const newExp = skill.exp + expGain.exp;
        const oldLevel = Math.floor(Math.log2(skill.exp / 100 + 1));
        const newLevel = Math.floor(Math.log2(newExp / 100 + 1));
        if (newLevel > oldLevel) {
          leveledUp = true;
          message.success(`${skill.name} leveled up to ${newLevel}!`);
        }
        return { ...skill, exp: newExp, highlight: true };
      }
      return skill;
    });

    setSkills(updatedSkills);

    setTimeout(() => {
      setSkills(skills => skills.map(s => ({ ...s, highlight: false })));
    }, 1000);

    if (leveledUp) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }

    const expGainText = habit.expGains.map(gain => {
      const skill = skills.find(s => s.id === gain.skillId);
      return `${gain.exp} ${skill.abbr}`;
    }).join(', ');

    message.success(`Completed ${habit.name} and gained ${expGainText} EXP!`);
  };

  const calculateProgress = (exp) => {
    const level = Math.floor(Math.log2(exp / 100 + 1));
    const currentLevelExp = Math.pow(2, level) * 100 - 100;
    const nextLevelExp = Math.pow(2, level + 1) * 100 - 100;
    const progressInLevel = exp - currentLevelExp;
    const levelRange = nextLevelExp - currentLevelExp;
    return (progressInLevel / levelRange) * 100;
  };

  const exportData = () => {
    const dataStr = JSON.stringify({ skills, habits });
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = 'adventure_log_data.json';
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const importData = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const { skills: importedSkills, habits: importedHabits } = JSON.parse(e.target.result);
        setSkills(importedSkills);
        setHabits(importedHabits);
        message.success('Data imported successfully!');
      } catch (error) {
        message.error('Error importing data. Please check the file format.');
      }
    };
    reader.readAsText(file);
    return false;  // Prevent upload
  };

  
  return (
    <Container>
      <HeaderContainer>
        <Header>Adventure Log</Header>
        <HeaderButtons>
          <StyledButton icon={<DownloadOutlined />} onClick={exportData}>Export</StyledButton>
          <Upload beforeUpload={importData} showUploadList={false}>
            <StyledButton icon={<UploadOutlined />}>Import</StyledButton>
          </Upload>
        </HeaderButtons>
      </HeaderContainer>
      
      <Section>
        <SectionHeader>
          <SectionTitle>Skills</SectionTitle>
          <Tooltip title="Add new skill">
            <AddButton size="small" icon={<PlusOutlined />} onClick={() => { setEditingItem(null); setIsSkillModalVisible(true); form.resetFields(); }} />
          </Tooltip>
        </SectionHeader>
        <SectionContent>
          {skills.map(skill => (
            <SkillCard 
              key={skill.id}
              animate={skill.highlight ? { scale: [1, 1.05, 1] } : {}}
              transition={{ duration: 0.5 }}
            >
              <Tooltip title={`EXP: ${skill.exp}`}>
                <h3 style={{ margin: '0 1rem 0 0', width: '120px' }}>{skill.name} ({skill.abbr})</h3>
              </Tooltip>
              
              <ProgressWrapper>
                <Progress 
                  percent={calculateProgress(skill.exp)}
                  format={() => `Lvl ${Math.floor(Math.log2(skill.exp / 100 + 1))}`} 
                  size="small"
                  strokeColor="#d97706"
                />
              </ProgressWrapper>
              
              <ButtonGroup>
                <StyledButton size="small" icon={<EditOutlined />} onClick={() => { setEditingItem(skill); setIsSkillModalVisible(true); form.setFieldsValue(skill); }} />
                <StyledButton size="small" icon={<DeleteOutlined />} onClick={() => deleteSkill(skill.id)} />
              </ButtonGroup>
            </SkillCard>
          ))}
        </SectionContent>
      </Section>
      <Section>
        <SectionHeader>
          <SectionTitle>Habits</SectionTitle>
          <Tooltip title="Add new habit">
            <AddButton size="small" icon={<PlusOutlined />} onClick={() => { setEditingItem(null); setIsHabitModalVisible(true); form.resetFields(); }} />
          </Tooltip>
        </SectionHeader>
        <SectionContent>
          {habits.map(habit => (
            <SkillCard key={habit.id}>
              <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                <h4 style={{ margin: '0 1rem 0 0', width: '150px' }}>{habit.name}</h4>
                <p style={{ margin: '0', flex: 1 }}>
                  EXP Gain: {habit.expGains.map(gain => {
                    const skill = skills.find(s => s.id === gain.skillId);
                    return `${gain.exp} ${skill ? skill.abbr : 'Unknown'}`;
                  }).join(', ')}
                </p>
                <ButtonGroup>
                  <Tooltip title="Complete habit">
                    <CompleteButton size="small" icon={<CheckOutlined />} onClick={() => completeHabit(habit)} />
                  </Tooltip>
                  <StyledButton size="small" icon={<EditOutlined />} onClick={() => { setEditingItem(habit); setIsHabitModalVisible(true); form.setFieldsValue({ ...habit, expGains: habit.expGains }); }} />
                  <StyledButton size="small" icon={<DeleteOutlined />} onClick={() => deleteHabit(habit.id)} />
                </ButtonGroup>
              </div>
            </SkillCard>
          ))}
        </SectionContent>
      </Section>

      <Footer>
      
      </Footer>

      <Modal
        title={editingItem ? "Edit Skill" : "Add Skill"}
        visible={isSkillModalVisible}
        onCancel={() => { setIsSkillModalVisible(false); setEditingItem(null); form.resetFields(); }}
        footer={null}
      >
        <Form form={form} onFinish={handleSkillSubmit}>
          <Form.Item name="name" rules={[{ required: true, message: 'Please input the skill name!' }]}>
            <Input placeholder="Skill Name" />
          </Form.Item>
          <Form.Item name="abbr" rules={[{ required: true, message: 'Please input the skill abbreviation!' }]}>
            <Input placeholder="Skill Abbreviation" />
          </Form.Item>
          <Form.Item>
            <StyledButton type="primary" htmlType="submit">
              Save
            </StyledButton>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title={editingItem ? "Edit Habit" : "Add Habit"}
        visible={isHabitModalVisible}
        onCancel={() => { setIsHabitModalVisible(false); setEditingItem(null); form.resetFields(); }}
        footer={null}
      >
        <Form form={form} onFinish={handleHabitSubmit}>
          <Form.Item name="name" rules={[{ required: true, message: 'Please input the habit name!' }]}>
            <Input placeholder="Habit Name" />
          </Form.Item>
          <Form.List name="expGains">
            {(fields, { add, remove }) => (
              <>
                {fields.map((field, index) => (
                  <Form.Item required={false} key={field.key}>
                    <Form.Item
                      {...field}
                      validateTrigger={['onChange', 'onBlur']}
                      rules={[
                        {
                          required: true,
                          message: "Please input skill and EXP gain or delete this field.",
                        },
                      ]}
                      noStyle
                    >
                      <Input.Group compact>
                        <Form.Item
                          name={[field.name, 'skillId']}
                          noStyle
                          rules={[{ required: true, message: 'Skill is required' }]}
                        >
                          <Select style={{ width: '60%' }} placeholder="Select skill">
                            {skills.map(skill => (
                              <Select.Option key={skill.id} value={skill.id}>{skill.name}</Select.Option>
                            ))}
                          </Select>
                        </Form.Item>
                        <Form.Item
                          name={[field.name, 'exp']}
                          noStyle
                          rules={[{ required: true, message: 'EXP is required' }]}
                        >
                          <Input style={{ width: '40%' }} placeholder="EXP" />
                        </Form.Item>
                      </Input.Group>
                    </Form.Item>
                    {fields.length > 1 ? (
                      <StyledButton size="small" onClick={() => remove(field.name)} icon={<DeleteOutlined />} />
                    ) : null}
                  </Form.Item>
                ))}
                <Form.Item>
                  <StyledButton type="dashed" onClick={() => add()} icon={<PlusOutlined />}>
                    Add Skill EXP
                  </StyledButton>
                </Form.Item>
              </>
            )}
          </Form.List>
          <Form.Item>
            <StyledButton type="primary" htmlType="submit">
              Save
            </StyledButton>
          </Form.Item>
        </Form>
      </Modal>
    </Container>
  );
};

export default SkillsAndHabitsTracker;