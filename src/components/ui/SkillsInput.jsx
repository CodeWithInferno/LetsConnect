// 'use client';
// import { useEffect, useState } from 'react';
// import { Command, CommandInput, CommandList, CommandItem } from '@/components/ui/command';
// import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
// import { X } from 'lucide-react';

// export function SkillsInput({ value, onChange }) {
//   const [search, setSearch] = useState('');
//   const [suggestions, setSuggestions] = useState([]);
//   const [open, setOpen] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchSkills = async () => {
//       try {
//         const response = await fetch('/api/skills');
        
//         if (!response.ok) {
//           throw new Error(`HTTP error! status: ${response.status}`);
//         }
        
//         const skillsData = await response.json();
        
//         if (!Array.isArray(skillsData)) {
//           throw new Error('Invalid skills data format');
//         }

//         setSuggestions(skillsData);
//         setError(null);
//       } catch (err) {
//         console.error('Error fetching skills:', err);
//         setError('Failed to load skills');
//         setSuggestions([]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchSkills();
//   }, []);

//   const handleAdd = (skill) => {
//     const trimmedSkill = skill.trim();
//     if (!trimmedSkill || value.includes(trimmedSkill)) return;
//     onChange([...value, trimmedSkill]);
//     setSearch('');
//     setOpen(false);
//   };

//   return (
//     <Popover open={open} onOpenChange={setOpen}>
//       <PopoverTrigger asChild>
//         <div className="flex flex-wrap gap-2 rounded-md border p-2 cursor-text">
//           {value.map((skill) => (
//             <div key={skill} className="flex items-center gap-1 bg-accent px-2 py-1 rounded">
//               {skill}
//               <X
//                 className="h-4 w-4 cursor-pointer"
//                 onClick={() => onChange(value.filter(s => s !== skill))}
//               />
//             </div>
//           ))}
//           <input
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             placeholder="Add skills..."
//             className="flex-1 bg-transparent outline-none min-w-[120px]"
//           />
//         </div>
//       </PopoverTrigger>
      
//       <PopoverContent className="w-[300px] p-0">
//         <Command>
//           <CommandInput 
//             placeholder="Search skills..."
//             value={search}
//             onValueChange={setSearch}
//           />
//           <CommandList>
//             {loading ? (
//               <div className="p-2 text-muted-foreground">Loading skills...</div>
//             ) : error ? (
//               <div className="p-2 text-destructive">{error}</div>
//             ) : suggestions.length === 0 ? (
//               <div className="p-2 text-muted-foreground">No skills found</div>
//             ) : (
//               suggestions
//                 .filter(skill => 
//                   skill &&
//                   skill.toLowerCase().includes(search.toLowerCase()) &&
//                   !value.includes(skill)
//                 )
//                 .map((skill) => (
//                   <CommandItem 
//                     key={skill}
//                     onSelect={() => handleAdd(skill)}
//                     className="cursor-pointer"
//                   >
//                     {skill}
//                   </CommandItem>
//                 ))
//             )}
//           </CommandList>
//         </Command>
//       </PopoverContent>
//     </Popover>
//   );
// }










'use client';
import { useEffect, useState } from 'react';
import { Command, CommandInput, CommandList, CommandItem, CommandEmpty } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { X, Plus } from 'lucide-react';

export function SkillsInput({ value, onChange }) {
  const [search, setSearch] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const response = await fetch('/api/skills');
        
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        const skillsData = await response.json();
        
        if (!Array.isArray(skillsData)) {
          throw new Error('Invalid skills data format');
        }

        setSuggestions(skillsData);
        setError(null);
      } catch (err) {
        console.error('Error fetching skills:', err);
        setError('Failed to load skills');
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSkills();
  }, []);

  const handleAdd = (skill) => {
    const trimmedSkill = skill.trim();
    if (!trimmedSkill || value.includes(trimmedSkill)) return;
    onChange([...value, trimmedSkill]);
    setSearch('');
    setOpen(false);
  };

  const filteredSuggestions = suggestions.filter(
    skill => skill.toLowerCase().includes(search.toLowerCase()) && !value.includes(skill)
  );

  const showAddNew = search.trim() && !filteredSuggestions.includes(search.trim());

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div className="flex flex-wrap gap-2 rounded-md border p-2 cursor-text">
          {value.map((skill) => (
            <div key={skill} className="flex items-center gap-1 bg-accent px-2 py-1 rounded">
              {skill}
              <X
                className="h-4 w-4 cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  onChange(value.filter(s => s !== skill));
                }}
              />
            </div>
          ))}
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Add skills..."
            className="flex-1 bg-transparent outline-none min-w-[120px]"
            onFocus={() => setOpen(true)}
          />
        </div>
      </PopoverTrigger>
      
      <PopoverContent className="w-[300px] p-0" align="start">
        <Command shouldFilter={false}>
          <CommandInput 
            placeholder="Search skills..."
            value={search}
            onValueChange={setSearch}
          />
          <CommandList>
            {loading ? (
              <div className="p-2 text-muted-foreground">Loading skills...</div>
            ) : error ? (
              <div className="p-2 text-destructive">{error}</div>
            ) : (
              <>
                {filteredSuggestions.map((skill) => (
                  <CommandItem 
                    key={skill}
                    onSelect={() => handleAdd(skill)}
                    className="cursor-pointer"
                  >
                    {skill}
                  </CommandItem>
                ))}
                
                {showAddNew && (
                  <CommandItem
                    onSelect={() => handleAdd(search.trim())}
                    className="cursor-pointer text-primary"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add "{search.trim()}"
                  </CommandItem>
                )}

                {!loading && !error && filteredSuggestions.length === 0 && !showAddNew && (
                  <CommandEmpty>No skills found</CommandEmpty>
                )}
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}