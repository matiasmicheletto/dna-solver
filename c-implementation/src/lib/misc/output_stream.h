#ifndef OUTPUT_STREAM_H
#define OUTPUT_STREAM_H

#include <iostream>
#include <fstream>

namespace streams{
    enum STREAM {CONSOLE, FILE, NONE};
}

class NullStream : public std::ostream {
public:
    NullStream() : std::ostream(nullptr) {}
    
    template<typename T>
    NullStream& operator<<(const T&) {
        // Do nothing with the data
        return *this;
    }
};

class OutputStream {
    public:
        OutputStream() : type(streams::STREAM::NONE) {}
        OutputStream(std::string filename) : type(streams::STREAM::FILE), filename(filename) {}
        OutputStream(streams::STREAM type) : type(type) {}
        
        std::ostream* getStream() {
            if(type == streams::STREAM::CONSOLE)
                return &std::cout;
            if(type == streams::STREAM::FILE){
                fileStream.open(filename);
                return &fileStream;
            }
            return &nullStream;
        }
        
        ~OutputStream() {
            if(type == streams::STREAM::FILE)
                fileStream.close();
        }

    private:
        streams::STREAM type;
        std::string filename;
        std::ofstream fileStream;
        NullStream nullStream;
};

#endif // OUTPUT_STREAM_H